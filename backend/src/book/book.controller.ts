import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BookService } from './book.service';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decoraters/roles.decorater';
import { ZodValidationPipe } from 'src/validators/validation.pipe';
import type {
  CreateBookPayload,
  UpdateBookPayload,
} from 'src/validators/book/book.schema';
import {
  CreateBookSchema,
  UpdateBookSchema,
} from 'src/validators/book/book.schema';

@Controller()
export class BookContorller {
  constructor(private bookservice: BookService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('book')
  @ApiResponse({ status: 200 })
  addBook(
    @Body(new ZodValidationPipe(CreateBookSchema)) body: CreateBookPayload,
  ) {
    return this.bookservice.addBook(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('books')
  @ApiResponse({ status: 201 })
  getBook() {
    return this.bookservice.getBooks();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('books/:bookId')
  @ApiResponse({ status: 201 })
  getBookByBookId(@Param('bookId') bookId: string) {
    return this.bookservice.getBookByBookId(bookId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('books/:bookId')
  @ApiResponse({ status: 200 })
  updateBook(
    @Param('bookId') bookId: string,
    @Body(new ZodValidationPipe(UpdateBookSchema)) body: UpdateBookPayload,
  ) {
    return this.bookservice.updateBook(bookId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('books/:bookId')
  @ApiResponse({ status: 200 })
  deleteBook(@Param('bookId') bookId: string) {
    return this.bookservice.deleteBook(bookId);
  }
}
