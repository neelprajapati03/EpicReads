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
import { CreateBookDto, UpdateBookDto } from 'src/Dtos/types/Book.dto';
import { BookService } from './book.service';
import { GetBookDto } from 'src/Dtos/GetBook.dto';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decoraters/roles.decorater';

@Controller()
export class BookContorller {
  constructor(private bookservice: BookService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('book')
  @ApiResponse({ type: CreateBookDto, status: 200 })
  addBook(@Body() body: CreateBookDto) {
    return this.bookservice.addBook(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('books')
  @ApiResponse({ type: GetBookDto, status: 201 })
  getBook() {
    return this.bookservice.getBooks();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get('books/:bookId')
  @ApiResponse({ type: GetBookDto, status: 201 })
  getBookByBookId(@Param('bookId') bookId: string) {
    return this.bookservice.getBookByBookId(bookId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('books/:bookId')
  @ApiResponse({ type: UpdateBookDto, status: 200 })
  updateBook(@Param('bookId') bookId: string, @Body() body: UpdateBookDto) {
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
