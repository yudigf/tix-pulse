import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { UserRole } from '@prisma/client';

@ApiTags('Events & Tickets')
@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Melihat daftar seluruh event yang dipublikasikan' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter kota (misal: Jakarta, Bandung)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter kategori (CONCERT, SPORTS, dll)' })
  @ApiResponse({ status: 200, description: 'Daftar event berhasil diambil' })
  async findAll(@Query('city') city?: string, @Query('category') category?: string) {
    return this.eventsService.findAllEvents(city, category);
  }

  @Get('organizer/my-events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Melihat seluruh event milik organizer yang sedang login beserta KPI' })
  @ApiResponse({ status: 200, description: 'Daftar event organizer berhasil diambil' })
  async getMyEvents(@CurrentUser('id') userId: string) {
    return this.eventsService.getMyEvents(userId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Melihat detail event dan ketersediaan tiket berdasarkan slug' })
  @ApiResponse({ status: 200, description: 'Detail event ditemukan' })
  @ApiResponse({ status: 404, description: 'Event tidak ditemukan' })
  async findOne(@Param('slug') slug: string) {
    return this.eventsService.findEventBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Membuat event baru (Hanya Event Organizer)' })
  @ApiResponse({ status: 201, description: 'Event berhasil dibuat' })
  @ApiResponse({ status: 403, description: 'Hanya Event Organizer yang diizinkan' })
  async createEvent(@CurrentUser('id') userId: string, @Body() dto: CreateEventDto) {
    return this.eventsService.createEvent(userId, dto);
  }

  @Post(':id/sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Menambahkan sesi jadwal ke event (Hanya Pemilik Event)' })
  @ApiResponse({ status: 201, description: 'Sesi event berhasil ditambahkan' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Menambahkan kategori tiket dan kuota ke sesi event' })
  @ApiResponse({ status: 201, description: 'Kategori tiket berhasil ditambahkan' })
  async createTicketType(
    @Param('sessionId') sessionId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTicketTypeDto,
  ) {
    return this.eventsService.createTicketType(sessionId, userId, dto);
  }
}
