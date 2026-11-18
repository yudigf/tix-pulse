import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventCategory, TicketMode } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ example: 'TixPulse Rock Fest 2026', description: 'Judul event' })
  @IsString()
  @IsNotEmpty({ message: 'Judul event wajib diisi' })
  title: string;

  @ApiProperty({ example: 'Festival musik rock terbesar se-Indonesia dengan 20 band.', description: 'Deskripsi lengkap event' })
  @IsString()
  @IsNotEmpty({ message: 'Deskripsi event wajib diisi' })
  description: string;

  @ApiPropertyOptional({ enum: EventCategory, default: EventCategory.CONCERT, description: 'Kategori event' })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', description: 'URL poster banner event' })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiProperty({ example: 'Stadion Gelora Bung Karno', description: 'Nama lokasi venue' })
  @IsString()
  @IsNotEmpty({ message: 'Nama venue wajib diisi' })
  venueName: string;

  @ApiPropertyOptional({ example: 'Jl. Pintu Satu Senayan, Gelora', description: 'Alamat lengkap venue' })
  @IsString()
  @IsOptional()
  venueAddress?: string;

  @ApiProperty({ example: 'Jakarta Pusat', description: 'Kota pelaksanaan' })
  @IsString()
  @IsNotEmpty({ message: 'Kota wajib diisi' })
  city: string;

  @ApiPropertyOptional({ example: 'Dilarang membawa senjata tajam dan minuman keras.', description: 'Syarat & ketentuan' })
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiPropertyOptional({
    enum: TicketMode,
    default: TicketMode.GENERAL_ADMISSION,
    description: 'Mode tiket: GENERAL_ADMISSION (berdasarkan kuota) atau RESERVED_SEATING (berdasarkan kursi)',
  })
  @IsEnum(TicketMode)
  @IsOptional()
  ticketMode?: TicketMode;

  @ApiPropertyOptional({ example: 'Presale 1', description: 'Nama kategori tiket awal' })
  @IsString()
  @IsOptional()
  ticketName?: string;

  @ApiPropertyOptional({ example: 250000, description: 'Harga tiket (Rupiah)' })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 500, description: 'Total kuota lembar tiket' })
  @IsOptional()
  quota?: number;
}
