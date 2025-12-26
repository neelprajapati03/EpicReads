import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/validators/validation.pipe';
import type { RegisterPayload } from 'src/validators/auth/register.schema';
import { RegisterSchema } from 'src/validators/auth/register.schema';
import { LoginSchema } from 'src/validators/auth/login.schema';
import type { LoginPayload } from 'src/validators/auth/login.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 200 })
  register(@Body(new ZodValidationPipe(RegisterSchema)) body: RegisterPayload) {
    return this.authService.register(body);
  }
  @Post('login')
  @ApiResponse({ status: 200 })
  login(@Body(new ZodValidationPipe(LoginSchema)) body: LoginPayload) {
    return this.authService.login(body);
  }
}
