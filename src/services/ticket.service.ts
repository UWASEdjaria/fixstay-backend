import { randomBytes } from 'crypto';
import { TicketStatus } from '@prisma/client';
import { TicketRepository } from '../repositories/ticket.repository';
import {
  CreateTicketDTO,
  ListTicketsDTO,
  UpdateTicketStatusDTO,
  AssignTicketDTO,
  TicketResponseDTO,
  PaginatedTicketsResponseDTO,
  GuestTicketTrackingResponseDTO,
  TicketFilterCriteria,
  TicketWithDetails,
} from '../interfaces/ticket.interface';

export class TicketService {
  private readonly ticketRepo: TicketRepository;

  constructor(ticketRepo: TicketRepository) {
    this.ticketRepo = ticketRepo;
  }

  /**
   * Creates a ticket after validating room and category exist.
   */
  public async createTicket(dto: CreateTicketDTO): Promise<TicketResponseDTO> {
    const roomExists: boolean = await this.ticketRepo.checkRoomExists(dto.roomId);
    if (!roomExists) {
      throw new Error(`Room with ID "${dto.roomId}" does not exist.`);
    }

    const categoryExists: boolean = await this.ticketRepo.checkCategoryExists(dto.categoryId);
    if (!categoryExists) {
      throw new Error(`Category with ID "${dto.categoryId}" does not exist.`);
    }

    const ticketNumber: string = this.generateTicketNumber();
    const guestTrackingToken: string = randomBytes(16).toString('hex');

    const createdTicket: TicketWithDetails = await this.ticketRepo.create({
      ticketNumber,
      roomId: dto.roomId,
      categoryId: dto.categoryId,
      title: dto.title.trim(),
      description: dto.description.trim(),
      urgency: dto.urgency,
      guestTrackingToken,
      reportedByGuestName: dto.reportedByGuestName?.trim(),
      guestContact: dto.guestContact?.trim(),
      attachmentUrls: dto.attachmentUrls,
    });

    return this.mapToResponseDTO(createdTicket);
  }

  /**
   * Retrieves paginated tickets with safe default bounds (e.g., max 100).
   */
  public async listTickets(dto: ListTicketsDTO): Promise<PaginatedTicketsResponseDTO> {
    const page: number = Math.max(1, dto.page ?? 1);
    const limit: number = Math.min(100, Math.max(1, dto.limit ?? 20));
    const skip: number = (page - 1) * limit;

    const filters: TicketFilterCriteria = {
      status: dto.status,
      urgency: dto.urgency,
      roomId: dto.roomId,
      assignedToId: dto.assignedToId,
    };

    const [tickets, total]: [TicketWithDetails[], number] = await Promise.all([
      this.ticketRepo.findMany({ filters, skip, take: limit }),
      this.ticketRepo.count(filters),
    ]);

    const totalPages: number = Math.ceil(total / limit);

    return {
      data: tickets.map((ticket: TicketWithDetails) => this.mapToResponseDTO(ticket)),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Enforces business rules when changing status (e.g. resolution summary mandatory).
   */
  public async updateStatus(
    ticketId: string,
    dto: UpdateTicketStatusDTO,
    changedByUserId: string
  ): Promise<TicketResponseDTO> {
    const existingTicket: TicketWithDetails | null = await this.ticketRepo.findById(ticketId);
    if (!existingTicket) {
      throw new Error(`Ticket with ID "${ticketId}" was not found.`);
    }

    if (existingTicket.status === TicketStatus.CLOSED || existingTicket.status === TicketStatus.CANCELLED) {
      throw new Error(`Cannot modify ticket in terminal state "${existingTicket.status}".`);
    }

    if (dto.status === TicketStatus.RESOLVED && (!dto.resolutionSummary || dto.resolutionSummary.trim().length === 0)) {
      throw new Error('A resolution summary is mandatory when marking a ticket as RESOLVED.');
    }

    const resolvedAt: Date | undefined = dto.status === TicketStatus.RESOLVED ? new Date() : undefined;

    const updatedTicket: TicketWithDetails = await this.ticketRepo.updateStatus(ticketId, {
      status: dto.status,
      previousStatus: existingTicket.status,
      changedById: changedByUserId,
      resolvedAt,
      resolutionSummary: dto.resolutionSummary?.trim(),
      comment: dto.comment?.trim(),
    });

    return this.mapToResponseDTO(updatedTicket);
  }

  /**
   * Assigns technician and moves status from PENDING to IN_PROGRESS.
   */
  public async assignTicket(
    ticketId: string,
    dto: AssignTicketDTO,
    changedByUserId: string
  ): Promise<TicketResponseDTO> {
    const existingTicket: TicketWithDetails | null = await this.ticketRepo.findById(ticketId);
    if (!existingTicket) {
      throw new Error(`Ticket with ID "${ticketId}" was not found.`);
    }

    const isAssignable: boolean = await this.ticketRepo.checkUserIsAssignableStaff(dto.assignedToUserId);
    if (!isAssignable) {
      throw new Error(`User with ID "${dto.assignedToUserId}" is not an active staff or admin member.`);
    }

    const newStatus: TicketStatus =
      existingTicket.status === TicketStatus.PENDING
        ? TicketStatus.IN_PROGRESS
        : existingTicket.status;

    const updatedTicket: TicketWithDetails = await this.ticketRepo.assignStaff(ticketId, {
      assignedToId: dto.assignedToUserId,
      changedById: changedByUserId,
      previousStatus: existingTicket.status,
      newStatus,
      comment: dto.comment?.trim(),
    });

    return this.mapToResponseDTO(updatedTicket);
  }

  /**
   * Sanitized view for guests to track their issue.
   */
  public async getGuestTicketTracking(token: string): Promise<GuestTicketTrackingResponseDTO> {
    const ticket = await this.ticketRepo.findByTrackingToken(token);
    if (!ticket) {
      throw new Error('Ticket not found or tracking link has expired.');
    }

    return {
      ticketNumber: ticket.ticketNumber,
      roomNumber: ticket.room.roomNumber,
      categoryName: ticket.category.name,
      title: ticket.title,
      description: ticket.description,
      urgency: ticket.urgency,
      status: ticket.status,
      createdAt: ticket.createdAt,
      resolvedAt: ticket.resolvedAt,
      resolutionSummary: ticket.resolutionSummary,
      timeline: ticket.auditLogs.map((log) => ({
        newStatus: log.newStatus,
        comment: log.comment,
        createdAt: log.createdAt,
      })),
    };
  }

  private mapToResponseDTO(ticket: TicketWithDetails): TicketResponseDTO {
    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      roomId: ticket.roomId,
      roomNumber: ticket.room.roomNumber,
      floor: ticket.room.floor,
      building: ticket.room.building,
      categoryId: ticket.categoryId,
      categoryName: ticket.category.name,
      title: ticket.title,
      description: ticket.description,
      urgency: ticket.urgency,
      status: ticket.status,
      reportedByGuestName: ticket.reportedByGuestName,
      guestTrackingToken: ticket.guestTrackingToken,
      assignedStaff: ticket.assignedTo
        ? {
            id: ticket.assignedTo.id,
            fullName: ticket.assignedTo.fullName,
            email: ticket.assignedTo.email,
          }
        : null,
      attachments: ticket.attachments.map((att) => ({
        id: att.id,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
      })),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  private generateTicketNumber(): string {
    const now: Date = new Date();
    const year: string = now.getFullYear().toString();
    const month: string = String(now.getMonth() + 1).padStart(2, '0');
    const day: string = String(now.getDate()).padStart(2, '0');
    const suffix: string = randomBytes(2).toString('hex').toUpperCase();

    return `TK-${year}${month}${day}-${suffix}`;
  }
}
