import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/db/drizzle.service';
import { booksTable } from 'src/db/schema';
import { GetBookDto } from 'src/Dtos/GetBook.dto';
import { CreateBookDto } from 'src/Dtos/types/Book.dto';

@Injectable()
export class BookService {
  constructor(private drizzleservice: DrizzleService) {}
  async addBook(data: CreateBookDto): Promise<GetBookDto> {
    const [created] = await this.drizzleservice.db
      .insert(booksTable)
      .values({
        title: data.title,
        author: data.author,
        category: data.category,
        stock: data.stock,
        price: data.price,
        imgUrl: data.imgUrl,
      })
      .returning();

    return {
      bookId: created.bookId,
      title: created.title,
      author: created.author,
      category: created.category,
      stock: created.stock,
      price: created.price,
      imgUrl: created.imgUrl ?? undefined,
    };
  }

  async getBooks(): Promise<GetBookDto[]> {
    const books = await this.drizzleservice.db.query.booksTable.findMany({
      where: eq(booksTable.isDeleted, false),
      orderBy: [desc(booksTable.createdAt)],
    });

    return books.map((book) => ({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      stock: book.stock,
      price: book.price,
      imgUrl: book.imgUrl ?? undefined,
    }));
  }
}
