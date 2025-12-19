import { IsEmail, IsNumber } from "class-validator";

export class GetUserDto{
    @IsNumber()
    userId:string;

    @IsEmail()
    email:string;
}