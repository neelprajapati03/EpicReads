import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @MinLength(8)
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?!.*\s).*$/, { message: 'Password cannot contain spaces' })
  @Matches(/[A-Z]/, {
    message: 'Password must have at least one uppercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must have at least one number' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must have at least one special character',
  })
  @ApiProperty({
    example: 'Password@123!',
  })
  password: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

}