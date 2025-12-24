import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from 'src/Dtos/types/Cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decoraters/roles.decorater';
import { ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cartservice: CartService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post()
  @ApiResponse({ type: AddToCartDto, status: 200 })
  addCart(@Req() req: Request, @Body() body: AddToCartDto) {
    const userId = req.user!.userId;
    return this.cartservice.addCart(userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get()
  @ApiResponse({ status: 200 })
  getCartItems(@Req() req: Request) {
    const userId = req.user!.userId;
    return this.cartservice.getCartItems(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Get(':cartId')
  @ApiResponse({ status: 200 })
  getCartItemById(@Req() req: Request, @Param('cartId') cartId: string) {
    const userId = req.user!.userId;
    return this.cartservice.getCartItemById(userId, cartId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Put(':cartId')
  @ApiResponse({ type: UpdateCartDto, status: 201 })
  updateCart(
    @Req() req: Request,
    @Param('cartId') cartId: string,
    @Body() body: UpdateCartDto,
  ) {
    const userId = req.user!.userId;
    return this.cartservice.updateCart(userId, cartId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Delete(':cartId')
  @ApiResponse({ status: 200 })
  deleteCartItem(@Req() req: Request, @Param('cartId') cartId: string) {
    const userId = req.user!.userId;
    return this.cartservice.deleteCartItem(userId, cartId);
  }
}
