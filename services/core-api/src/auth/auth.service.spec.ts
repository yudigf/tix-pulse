import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserRole } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
    };
  };
  let jwtService: {
    sign: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    };

    jwtService = {
      sign: vi.fn().mockReturnValue('mock_jwt_token_xyz'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('harus berhasil meregistrasi pembeli (BUYER)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'buyer@tixpulse.com',
        fullName: 'Budi Pembeli',
        phoneNumber: '08123456789',
        role: UserRole.BUYER,
        passwordHash: 'hashed_password',
        organizer: null,
      });

      const result = await service.register({
        email: 'buyer@tixpulse.com',
        password: 'password123',
        fullName: 'Budi Pembeli',
        phoneNumber: '08123456789',
      });

      expect(result.message).toBe('Registrasi berhasil');
      expect(result.accessToken).toBe('mock_jwt_token_xyz');
      expect(result.user.email).toBe('buyer@tixpulse.com');
      expect((result.user as any).passwordHash).toBeUndefined();
    });

    it('harus melempar ConflictException jika email sudah terdaftar', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.register({
          email: 'duplicate@tixpulse.com',
          password: 'password123',
          fullName: 'Duplikat User',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('harus membuat record Organizer jika role adalah ORGANIZER', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'eo-uuid-1',
        email: 'eo@promoter.com',
        fullName: 'Promoter Musik',
        phoneNumber: '08111222333',
        role: UserRole.ORGANIZER,
        passwordHash: 'hashed_password',
        organizer: {
          id: 'org-uuid-1',
          name: 'SoundPulse Entertainment',
          slug: 'soundpulse-entertainment-1234',
        },
      });

      const result = await service.register({
        email: 'eo@promoter.com',
        password: 'password123',
        fullName: 'Promoter Musik',
        role: UserRole.ORGANIZER,
        organizerName: 'SoundPulse Entertainment',
      });

      expect(result.user.role).toBe(UserRole.ORGANIZER);
      expect(result.user.organizer?.name).toBe('SoundPulse Entertainment');
    });
  });

  describe('login', () => {
    it('harus berhasil login dengan kredensial yang valid', async () => {
      const plainPassword = 'password123';
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'buyer@tixpulse.com',
        fullName: 'Budi Pembeli',
        role: UserRole.BUYER,
        passwordHash,
        organizer: null,
      });

      const result = await service.login({
        email: 'buyer@tixpulse.com',
        password: plainPassword,
      });

      expect(result.message).toBe('Login berhasil');
      expect(result.accessToken).toBe('mock_jwt_token_xyz');
      expect(result.user.email).toBe('buyer@tixpulse.com');
    });

    it('harus gagal login jika password salah', async () => {
      const passwordHash = await bcrypt.hash('correctPassword', 10);

      prisma.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'buyer@tixpulse.com',
        passwordHash,
      });

      await expect(
        service.login({
          email: 'buyer@tixpulse.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('harus gagal login jika email tidak ditemukan', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'unknown@tixpulse.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
