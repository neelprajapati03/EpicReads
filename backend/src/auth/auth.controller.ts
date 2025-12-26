import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/validators/validation.pipe';
import type { RegisterPayload } from 'src/validators/auth/register.schema';
import { RegisterSchema } from 'src/validators/auth/register.schema';
import { LoginSchema } from 'src/validators/auth/login.schema';
import type { LoginPayload } from 'src/validators/auth/login.schema';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import type { Request } from 'express';

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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: "Returns the authenticated user's profile",
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req: Request) {
    const userId = req.user!.userId;
    return this.authService.getProfile(userId);
  }

  @Get(':userId')
  @ApiResponse({ status: 200, description: 'Returns user details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUser(@Param('userId') userId: string) {
    return this.authService.getUser(userId);
  }
}
