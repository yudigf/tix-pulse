import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketTypeDto {
  @ApiProperty({ example: 'VIP Early Bird', description: 'Nama kategori tiket' })
  @IsString()
  @IsNotEmpty({ message: 'Nama tiket wajib diisi' })
  name: string;

  @ApiPropertyOptional({ example: 'Akses baris depan + merchandise eksklusif', description: 'Deskripsi fasilitas tiket' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 750000, description: 'Harga tiket dalam integer Rupiah (misal: 750000)' })
  @IsInt({ message: 'Harga harus berupa bilangan bulat' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  price: number;

  @ApiProperty({ example: 500, description: 'Total kuota lembar tiket yang dijual' })
  @IsInt({ message: 'Kuota harus berupa bilangan bulat' })
  @IsPositive({ message: 'Kuota harus lebih dari 0' })
  quota: number;

  @ApiPropertyOptional({ example: 4, default: 5, description: 'Batas maksimal tiket yang dapat dibeli per order' })
  @IsInt()
  @IsOptional()
  maxPerOrder?: number;

  @ApiProperty({ example: '2026-11-20T00:00:00.000Z', description: 'Waktu penjualan dimulai (ISO 8601)' })
  @IsDateString({}, { message: 'Format waktu mulai penjualan harus ISO 8601' })
  saleStart: string;

  @ApiProperty({ example: '2026-11-30T23:59:59.000Z', description: 'Waktu penjualan berakhir (ISO 8601)' })
  @IsDateString({}, { message: 'Format waktu akhir penjualan harus ISO 8601' })
  saleEnd: string;
}
