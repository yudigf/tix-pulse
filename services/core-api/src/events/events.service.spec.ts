import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventStatus, EventCategory, TicketMode } from '@prisma/client';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: {
    organizer: {
      findUnique: ReturnType<typeof vi.fn>;
    };
    event: {
      create: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
    };
    eventSession: {
      create: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
    };
    ticketType: {
      create: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    prisma = {
      organizer: {
        findUnique: vi.fn(),
      },
      event: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      eventSession: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
      ticketType: {
        create: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('createEvent', () => {
    it('harus berhasil membuat event jika user adalah Organizer', async () => {
      prisma.organizer.findUnique.mockResolvedValue({
        id: 'org-1',
        userId: 'user-eo-1',
      });

      prisma.event.create.mockResolvedValue({
        id: 'event-1',
        title: 'TixPulse Rock Fest 2026',
        slug: 'tixpulse-rock-fest-2026-1234',
        category: EventCategory.CONCERT,
        ticketMode: TicketMode.GENERAL_ADMISSION,
        status: EventStatus.PUBLISHED,
      });

      const result = await service.createEvent('user-eo-1', {
        title: 'TixPulse Rock Fest 2026',
        description: 'Festival musik rock terbesar',
        venueName: 'Gelora Bung Karno',
        venueAddress: 'Jl. Pintu Satu Senayan',
        city: 'Jakarta',
      });

      expect(result.id).toBe('event-1');
      expect(result.title).toBe('TixPulse Rock Fest 2026');
    });

    it('harus menolak pembuatan event jika user bukan Organizer', async () => {
      prisma.organizer.findUnique.mockResolvedValue(null);

      await expect(
        service.createEvent('user-buyer-1', {
          title: 'Illegal Event',
          description: 'No permission',
          venueName: 'Nowhere',
          venueAddress: 'No address',
          city: 'Unknown',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findEventBySlug', () => {
    it('harus melempar NotFoundException jika slug tidak ada', async () => {
      prisma.event.findUnique.mockResolvedValue(null);

      await expect(service.findEventBySlug('non-existent-event')).rejects.toThrow(NotFoundException);
    });
  });
});
