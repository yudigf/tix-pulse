import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateTicketTypeDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tiket wajib diisi' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt({ message: 'Harga harus berupa bilangan bulat' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  price: number;

  @IsInt({ message: 'Kuota harus berupa bilangan bulat' })
  @IsPositive({ message: 'Kuota harus lebih dari 0' })
  quota: number;

  @IsInt()
  @IsOptional()
  maxPerOrder?: number;

  @IsDateString({}, { message: 'Format waktu mulai penjualan harus ISO 8601' })
  saleStart: string;

  @IsDateString({}, { message: 'Format waktu akhir penjualan harus ISO 8601' })
  saleEnd: string;
}
