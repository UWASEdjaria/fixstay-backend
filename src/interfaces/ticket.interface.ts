import { Prisma, TicketStatus, UrgencyLevel } from '@prisma/client';

export type TicketWithDetails = Prisma.TicketGetPayload<{
  include: {
    room: {
      select: {
        id: true;
        roomNumber: true;
        floor: true;
        building: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
      };
    };
    assignedTo: {
      select: {
        id: true;
        fullName: true;
        email: true;
      };
    };
    attachments: {
      select: {
        id: true;
        fileUrl: true;
        fileType: true;
        attachmentType: true;
        createdAt: true;
      };
    };
  };
}>;

export interface TicketFilterCriteria {
  status?: TicketStatus;
  urgency?: UrgencyLevel;
  roomId?: string;
  assignedToId?: string;
}

export interface FindTicketsRepositoryParams {
  filters: TicketFilterCriteria;
  skip: number;
  take: number;
}

export interface CreateTicketRepositoryInput {
  ticketNumber: string;
  roomId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  guestTrackingToken: string;
  reportedByGuestName?: string;
  guestContact?: string;
  attachmentUrls?: string[];
}

export interface UpdateStatusRepositoryInput {
  status: TicketStatus;
  previousStatus: TicketStatus;
  changedById: string;
  resolvedAt?: Date;
  resolutionSummary?: string;
  comment?: string;
}

export interface AssignStaffRepositoryInput {
  assignedToId: string;
  changedById: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  comment?: string;
}

export interface CreateTicketDTO {
  roomId: string;
  categoryId: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  reportedByGuestName?: string;
  guestContact?: string;
  attachmentUrls?: string[];
}

export interface ListTicketsDTO {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  urgency?: UrgencyLevel;
  roomId?: string;
  assignedToId?: string;
}

export interface UpdateTicketStatusDTO {
  status: TicketStatus;
  comment?: string;
  resolutionSummary?: string;
}

export interface AssignTicketDTO {
  assignedToUserId: string;
  comment?: string;
}

export interface TicketAttachmentDTO {
  id: string;
  fileUrl: string;
  fileType: string;
}

export interface AssignedStaffDTO {
  id: string;
  fullName: string;
  email: string;
}

export interface TicketResponseDTO {
  id: string;
  ticketNumber: string;
  roomId: string;
  roomNumber: string;
  floor: number;
  building: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  status: TicketStatus;
  reportedByGuestName: string | null;
  guestTrackingToken: string | null;
  assignedStaff: AssignedStaffDTO | null;
  attachments: TicketAttachmentDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMetaDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedTicketsResponseDTO {
  data: TicketResponseDTO[];
  meta: PaginationMetaDTO;
}

export interface PublicAuditLogEntryDTO {
  newStatus: TicketStatus | null;
  comment: string | null;
  createdAt: Date;
}

export interface GuestTicketTrackingResponseDTO {
  ticketNumber: string;
  roomNumber: string;
  categoryName: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  status: TicketStatus;
  createdAt: Date;
  resolvedAt: Date | null;
  resolutionSummary: string | null;
  timeline: PublicAuditLogEntryDTO[];
}
