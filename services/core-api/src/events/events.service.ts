import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto.js';
import { EventStatus } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(userId: string, dto: CreateEventDto) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
    });

    if (!organizer) {
      throw new ForbiddenException('Hanya akun Event Organizer yang dapat membuat event');
    }

    const baseSlug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

    return this.prisma.event.create({
      data: {
        organizerId: organizer.id,
        title: dto.title,
        slug,
        description: dto.description,
        category: dto.category,
        bannerUrl: dto.bannerUrl,
        venueName: dto.venueName,
        venueAddress: dto.venueAddress,
        city: dto.city,
        termsAndConditions: dto.termsAndConditions,
        ticketMode: dto.ticketMode,
        status: EventStatus.PUBLISHED,
      },
      include: {
        organizer: {
          select: { id: true, name: true, slug: true, logoUrl: true },
        },
      },
    });
  }

  async findAllEvents(city?: string, category?: string) {
    return this.prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(category && { category: category as any }),
      },
      include: {
        organizer: {
          select: { id: true, name: true, logoUrl: true },
        },
        sessions: {
          include: {
            ticketTypes: {
              where: { isActive: true },
              select: { id: true, name: true, price: true, quota: true, soldCount: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findEventBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: true,
        sessions: {
          include: {
            ticketTypes: {
              where: { isActive: true },
            },
            seats: {
              select: { id: true, seatCode: true, row: true, col: true, status: true, ticketTypeId: true },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event dengan slug '${slug}' tidak ditemukan`);
    }

    return event;
  }

  async createSession(eventId: string, userId: string, dto: CreateSessionDto) {
    await this.verifyEventOwnership(eventId, userId);

    return this.prisma.eventSession.create({
      data: {
        eventId,
        title: dto.title,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
      },
    });
  }

  async createTicketType(sessionId: string, userId: string, dto: CreateTicketTypeDto) {
    const session = await this.prisma.eventSession.findUnique({
      where: { id: sessionId },
      include: { event: true },
    });

    if (!session) {
      throw new NotFoundException('Sesi event tidak ditemukan');
    }

    await this.verifyEventOwnership(session.eventId, userId);

    return this.prisma.ticketType.create({
      data: {
        sessionId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quota: dto.quota,
        maxPerOrder: dto.maxPerOrder || 5,
        saleStart: new Date(dto.saleStart),
        saleEnd: new Date(dto.saleEnd),
      },
    });
  }

  private async verifyEventOwnership(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });

    if (!event) {
      throw new NotFoundException('Event tidak ditemukan');
    }

    if (event.organizer.userId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengedit event ini');
    }

    return event;
  }
}
