import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul sesi wajib diisi' })
  title: string;

  @IsDateString({}, { message: 'Format waktu mulai (startTime) harus ISO 8601' })
  startTime: string;

  @IsDateString({}, { message: 'Format waktu selesai (endTime) harus ISO 8601' })
  endTime: string;
}
