import { PrismaClient, Prisma, TicketStatus, UserRole } from '@prisma/client';
import {
  TicketWithDetails,
  TicketFilterCriteria,
  FindTicketsRepositoryParams,
  CreateTicketRepositoryInput,
  UpdateStatusRepositoryInput,
  AssignStaffRepositoryInput,
} from '../interfaces/ticket.interface';

export class TicketRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * 1. Inserts a new ticket into PostgreSQL with optional photos and an initial audit log.
   */
  public async create(data: CreateTicketRepositoryInput): Promise<TicketWithDetails> {
    return this.prisma.ticket.create({
      data: {
        ticketNumber: data.ticketNumber,
        roomId: data.roomId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        urgency: data.urgency,
        guestTrackingToken: data.guestTrackingToken,
        reportedByGuestName: data.reportedByGuestName,
        guestContact: data.guestContact,
        status: TicketStatus.PENDING,
        attachments: data.attachmentUrls && data.attachmentUrls.length > 0
          ? {
              create: data.attachmentUrls.map((url: string) => ({
                fileUrl: url,
                fileType: 'image/jpeg',
              })),
            }
          : undefined,
        auditLogs: {
          create: {
            newStatus: TicketStatus.PENDING,
            comment: 'Ticket initially logged into system.',
            isInternalOnly: false,
          },
        },
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            building: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            fileUrl: true,
            fileType: true,
            attachmentType: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * 2. Fetches paginated tickets matching filter criteria (status, urgency, room, assignee).
   */
  public async findMany(params: FindTicketsRepositoryParams): Promise<TicketWithDetails[]> {
    const where: Prisma.TicketWhereInput = this.buildWhereClause(params.filters);

    return this.prisma.ticket.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            building: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            fileUrl: true,
            fileType: true,
            attachmentType: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * 3. Counts total tickets matching filter criteria for pagination metadata.
   */
  public async count(filters: TicketFilterCriteria): Promise<number> {
    const where: Prisma.TicketWhereInput = this.buildWhereClause(filters);
    return this.prisma.ticket.count({ where });
  }

  /**
   * 4. Finds a single ticket by UUID with full relations.
   */
  public async findById(id: string): Promise<TicketWithDetails | null> {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            building: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            fileUrl: true,
            fileType: true,
            attachmentType: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * 5. Finds a ticket using the guest capability tracking token (public view).
   */
  public async findByTrackingToken(token: string) {
    return this.prisma.ticket.findUnique({
      where: { guestTrackingToken: token },
      include: {
        room: {
          select: {
            roomNumber: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        auditLogs: {
          where: { isInternalOnly: false },
          orderBy: { createdAt: 'asc' },
          select: {
            newStatus: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * 6. Updates ticket status and records a change in the audit log.
   */
  public async updateStatus(
    id: string,
    data: UpdateStatusRepositoryInput
  ): Promise<TicketWithDetails> {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        status: data.status,
        resolvedAt: data.resolvedAt,
        resolutionSummary: data.resolutionSummary,
        auditLogs: {
          create: {
            previousStatus: data.previousStatus,
            newStatus: data.status,
            changedById: data.changedById,
            comment: data.comment,
            isInternalOnly: false,
          },
        },
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            building: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            fileUrl: true,
            fileType: true,
            attachmentType: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * 7. Assigns staff to a ticket and records an audit log entry.
   */
  public async assignStaff(
    id: string,
    data: AssignStaffRepositoryInput
  ): Promise<TicketWithDetails> {
    return this.prisma.ticket.update({
      where: { id },
      data: {
        assignedToId: data.assignedToId,
        status: data.newStatus,
        auditLogs: {
          create: {
            previousStatus: data.previousStatus,
            newStatus: data.newStatus,
            changedById: data.changedById,
            comment: data.comment ?? `Assigned to staff member ID: ${data.assignedToId}`,
            isInternalOnly: true,
          },
        },
      },
      include: {
        room: {
          select: {
            id: true,
            roomNumber: true,
            floor: true,
            building: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        attachments: {
          select: {
            id: true,
            fileUrl: true,
            fileType: true,
            attachmentType: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Checks if a room exists before creating a ticket.
   */
  public async checkRoomExists(roomId: string): Promise<boolean> {
    const count: number = await this.prisma.room.count({
      where: { id: roomId },
    });
    return count > 0;
  }

  /**
   * Checks if a category exists before creating a ticket.
   */
  public async checkCategoryExists(categoryId: string): Promise<boolean> {
    const count: number = await this.prisma.category.count({
      where: { id: categoryId },
    });
    return count > 0;
  }

  /**
   * Verifies if a user has STAFF or ADMIN privileges.
   */
  public async checkUserIsAssignableStaff(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return false;
    }

    return user.role === UserRole.STAFF || user.role === UserRole.ADMIN;
  }

  /**
   * Helper: Builds the Prisma where filter object.
   */
  private buildWhereClause(filters: TicketFilterCriteria): Prisma.TicketWhereInput {
    const where: Prisma.TicketWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.urgency) {
      where.urgency = filters.urgency;
    }
    if (filters.roomId) {
      where.roomId = filters.roomId;
    }
    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }

    return where;
  }
}
