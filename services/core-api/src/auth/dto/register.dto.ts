import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi' })
  fullName: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(UserRole, { message: 'Role harus salah satu dari: BUYER, ORGANIZER' })
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  organizerName?: string;
}
