import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'budi@example.com', description: 'Email unik pengguna' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6, description: 'Kata sandi minimal 6 karakter' })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap pengguna' })
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  fullName: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'Nomor telepon pengguna' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.BUYER,
    description: 'Pilihan role: BUYER (Pembeli) atau ORGANIZER (Promoter Event)',
  })
  @IsEnum(UserRole, { message: 'Role harus salah satu dari: BUYER, ORGANIZER' })
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    example: 'SoundPulse Productions',
    description: 'Nama Event Organizer (diisi jika mendaftar sebagai ORGANIZER)',
  })
  @IsString()
  @IsOptional()
  organizerName?: string;
}
