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
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decoraters/roles.decorater';
import { ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { ZodValidationPipe } from 'src/validators/validation.pipe';
import type {
  AddToCartPayload,
  UpdateCartPayload,
} from 'src/validators/cart/cart.schema';
import {
  AddToCartSchema,
  UpdateCartSchema,
} from 'src/validators/cart/cart.schema';

@Controller('cart')
export class CartController {
  constructor(private cartservice: CartService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @Post()
  @ApiResponse({ status: 200 })
  addCart(
    @Req() req: Request,
    @Body(new ZodValidationPipe(AddToCartSchema)) body: AddToCartPayload,
  ) {
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
  @ApiResponse({ status: 201 })
  updateCart(
    @Req() req: Request,
    @Param('cartId') cartId: string,
    @Body(new ZodValidationPipe(UpdateCartSchema)) body: UpdateCartPayload,
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
