import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class GetBookDto {
  @IsString()
  bookId: string; // ✅ UUID is string

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  category: string;

  @IsString()
  price: string; // ✅ numeric → string

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  imgUrl?: string;
}
