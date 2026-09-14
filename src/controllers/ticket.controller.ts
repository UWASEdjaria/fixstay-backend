import {
  Controller,
  Route,
  Tags,
  Post,
  Get,
  Patch,
  Body,
  Path,
  Query,
  SuccessResponse,
  Response,
  Security,
  Request,
} from 'tsoa';
import express from 'express';
import { TicketStatus, UrgencyLevel } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { TicketRepository } from '../repositories/ticket.repository';
import { TicketService } from '../services/ticket.service';
import {
  CreateTicketDTO,
  UpdateTicketStatusDTO,
  AssignTicketDTO,
  TicketResponseDTO,
  PaginatedTicketsResponseDTO,
  GuestTicketTrackingResponseDTO,
} from '../interfaces/ticket.interface';
import { AuthenticatedUser, ErrorResponseDTO } from '../interfaces/auth.interface';

const defaultTicketRepo = new TicketRepository(prisma);
const defaultTicketService = new TicketService(defaultTicketRepo);

@Route('api/v1/tickets')
@Tags('Tickets')
export class TicketController extends Controller {
  private readonly ticketService: TicketService;

  constructor(ticketService: TicketService = defaultTicketService) {
    super();
    this.ticketService = ticketService;
  }

  @Post('')
  @SuccessResponse(201, 'Ticket created successfully')
  @Response<ErrorResponseDTO>(400, 'Bad Request')
  public async createTicket(
    @Body() requestBody: CreateTicketDTO
  ): Promise<TicketResponseDTO> {
    this.setStatus(201);
    return this.ticketService.createTicket(requestBody);
  }

  @Get('')
  @Security('jwt', ['STAFF', 'ADMIN'])
  @SuccessResponse(200, 'Tickets retrieved successfully')
  @Response<ErrorResponseDTO>(401, 'Unauthorized')
  public async listTickets(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() status?: TicketStatus,
    @Query() urgency?: UrgencyLevel,
    @Query() roomId?: string,
    @Query() assignedToId?: string
  ): Promise<PaginatedTicketsResponseDTO> {
    this.setStatus(200);
    return this.ticketService.listTickets({
      page,
      limit,
      status,
      urgency,
      roomId,
      assignedToId,
    });
  }

  @Patch('{id}/status')
  @Security('jwt', ['STAFF', 'ADMIN'])
  @SuccessResponse(200, 'Ticket status updated')
  @Response<ErrorResponseDTO>(400, 'Bad Request')
  @Response<ErrorResponseDTO>(404, 'Ticket Not Found')
  public async updateStatus(
    @Path() id: string,
    @Body() body: UpdateTicketStatusDTO,
    @Request() req: express.Request
  ): Promise<TicketResponseDTO> {
    const user: AuthenticatedUser = (req as express.Request & { user: AuthenticatedUser }).user;
    this.setStatus(200);
    return this.ticketService.updateStatus(id, body, user.userId);
  }

  @Patch('{id}/assign')
  @Security('jwt', ['STAFF', 'ADMIN'])
  @SuccessResponse(200, 'Ticket assigned')
  @Response<ErrorResponseDTO>(400, 'Bad Request')
  @Response<ErrorResponseDTO>(404, 'Ticket Not Found')
  public async assignTicket(
    @Path() id: string,
    @Body() body: AssignTicketDTO,
    @Request() req: express.Request
  ): Promise<TicketResponseDTO> {
    const user: AuthenticatedUser = (req as express.Request & { user: AuthenticatedUser }).user;
    this.setStatus(200);
    return this.ticketService.assignTicket(id, body, user.userId);
  }

  @Get('track/{token}')
  @SuccessResponse(200, 'Ticket tracking details retrieved')
  @Response<ErrorResponseDTO>(404, 'Ticket not found')
  public async trackTicket(
    @Path() token: string
  ): Promise<GuestTicketTrackingResponseDTO> {
    this.setStatus(200);
    return this.ticketService.getGuestTicketTracking(token);
  }
}
