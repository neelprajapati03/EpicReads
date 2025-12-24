import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  category: string;

  @IsString() // ✅ numeric
  price: string;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  imgUrl?: string;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
