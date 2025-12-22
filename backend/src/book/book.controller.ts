import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateBookDto } from 'src/Dtos/types/Book.dto';
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

  @Get('/books')
  @ApiResponse({ type: GetBookDto, status: 201 })
  getBook() {
    return this.bookservice.getBooks();
  }
}
