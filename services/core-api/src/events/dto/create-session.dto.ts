import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'Day 1 - Main Show', description: 'Nama sesi atau jadwal hari event' })
  @IsString()
  @IsNotEmpty({ message: 'Judul sesi wajib diisi' })
  title: string;

  @ApiProperty({ example: '2026-12-01T18:00:00.000Z', description: 'Waktu mulai sesi (ISO 8601)' })
  @IsDateString({}, { message: 'Format waktu mulai (startTime) harus ISO 8601' })
  startTime: string;

  @ApiProperty({ example: '2026-12-01T23:00:00.000Z', description: 'Waktu selesai sesi (ISO 8601)' })
  @IsDateString({}, { message: 'Format waktu selesai (endTime) harus ISO 8601' })
  endTime: string;
}
