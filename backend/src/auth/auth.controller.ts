import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { RegisterDto } from "src/Dtos/types/register.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/Dtos/types/login.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}

    @Post('register')
    @ApiResponse({type:RegisterDto,status:200})
    register(@Body() body:RegisterDto){
        return this.authService.register(body);
    }
    @Post('login')
    @ApiResponse({type:LoginDto,status:200})
    login(@Body() body:LoginDto){
        return this.authService.login(body);
    }
}