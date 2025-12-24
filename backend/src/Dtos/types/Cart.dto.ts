import { IsInt, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  bookId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartDto {
  @IsInt()
  @Min(1)
  quantity: number;
}
