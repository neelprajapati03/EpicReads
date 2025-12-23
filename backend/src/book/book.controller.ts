import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateBookDto, UpdateBookDto } from 'src/Dtos/types/Book.dto';
import { BookService } from './book.service';
import { GetBookDto } from 'src/Dtos/GetBook.dto';

@Controller()
export class BookContorller {
  constructor(private bookservice: BookService) {}

  @Post('book')
  @ApiResponse({ type: CreateBookDto, status: 200 })
  addBook(@Body() body: CreateBookDto) {
    return this.bookservice.addBook(body);
  }

  @Get('books')
  @ApiResponse({ type: GetBookDto, status: 201 })
  getBook() {
    return this.bookservice.getBooks();
  }
  @Get('books/:bookId')
  @ApiResponse({ type: GetBookDto, status: 201 })
  getBookByBookId(@Param('bookId') bookId: string) {
    return this.bookservice.getBookByBookId(bookId);
  }

  @Put('books/:bookId')
  @ApiResponse({ type: UpdateBookDto, status: 200 })
  updateBook(@Param('bookId') bookId: string, @Body() body: UpdateBookDto) {
    return this.bookservice.updateBook(bookId, body);
  }

  @Delete('books/:bookId')
  @ApiResponse({ status: 200 })
  deleteBook(@Param('bookId') bookId: string) {
    return this.bookservice.deleteBook(bookId);
  }
}
