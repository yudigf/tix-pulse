import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventCategory, TicketMode } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul event wajib diisi' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi event wajib diisi' })
  description: string;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama venue wajib diisi' })
  venueName: string;

  @IsString()
  @IsNotEmpty({ message: 'Alamat venue wajib diisi' })
  venueAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Kota wajib diisi' })
  city: string;

  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @IsEnum(TicketMode)
  @IsOptional()
  ticketMode?: TicketMode;
}
