import { Global, Module } from '@nestjs/common';
import { BookContorller } from './book.controller';
import { BookService } from './book.service';

@Global()
@Module({
  controllers: [BookContorller],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
