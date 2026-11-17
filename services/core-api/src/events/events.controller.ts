import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '@prisma/client';

@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(@Query('city') city?: string, @Query('category') category?: string) {
    return this.eventsService.findAllEvents(city, category);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.eventsService.findEventBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.SUPER_ADMIN)
  async createEvent(@CurrentUser('id') userId: string, @Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(userId, dto);
  }

  @Post(':id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.SUPER_ADMIN)
  async createSession(
    @Param('id') eventId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.eventsService.createSession(eventId, userId, dto);
  }

  @Post('sessions/:sessionId/ticket-types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.SUPER_ADMIN)
  async createTicketType(
    @Param('sessionId') sessionId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTicketTypeDto,
  ) {
    return this.eventsService.createTicketType(sessionId, userId, dto);
  }
}
