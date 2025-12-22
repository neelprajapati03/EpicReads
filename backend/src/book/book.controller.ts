import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateBookDto } from 'src/Dtos/types/Book.dto';
import { BookService } from './book.service';

@Controller()
export class BookContorller {
  constructor(private bookservice: BookService) {}

  @Post('book')
  @ApiResponse({ type: CreateBookDto, status: 200 })
  addBook(@Body() body: CreateBookDto) {
    return this.bookservice.addBook(body);
  }
}
