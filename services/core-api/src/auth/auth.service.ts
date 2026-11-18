import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);
    const role = dto.role || UserRole.BUYER;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        role,
        ...(role === UserRole.ORGANIZER && {
          organizer: {
            create: {
              name: dto.organizerName || dto.fullName,
              slug: (dto.organizerName || dto.fullName)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4),
            },
          },
        }),
      },
      include: {
        organizer: true,
      },
    });

    const accessToken = this.generateToken(user.id, user.email, user.role);

    const { passwordHash: _, ...sanitizedUser } = user;
    return {
      message: 'Registrasi berhasil',
      user: sanitizedUser,
      accessToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { organizer: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const accessToken = this.generateToken(user.id, user.email, user.role);

    const { passwordHash: _, ...sanitizedUser } = user;
    return {
      message: 'Login berhasil',
      user: sanitizedUser,
      accessToken,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organizer: true },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan');
    }

    const { passwordHash: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private generateToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }
}

