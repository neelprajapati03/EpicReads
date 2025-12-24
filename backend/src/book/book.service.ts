import { Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import e from 'express';
import { DrizzleService } from 'src/db/drizzle.service';
import { booksTable } from 'src/db/schema';
import { GetBookDto } from 'src/Dtos/GetBook.dto';
import { CreateBookDto, UpdateBookDto } from 'src/Dtos/types/Book.dto';

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

  async getBookByBookId(bookId: string): Promise<GetBookDto> {
    const exisitng = await this.drizzleservice.db.query.booksTable.findFirst({
      where: eq(booksTable.bookId, bookId),
      columns: {
        bookId: true,
        title: true,
        author: true,
        category: true,
        stock: true,
        price: true,
        imgUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!exisitng) {
      throw new NotFoundException('BookId not found');
    }

    return {
      bookId: exisitng.bookId,
      title: exisitng.title,
      author: exisitng.author,
      category: exisitng.category,
      stock: exisitng.stock,
      price: exisitng.price,
      imgUrl: exisitng.imgUrl ?? undefined,
    };
  }

  async updateBook(bookId: string, data: UpdateBookDto): Promise<GetBookDto> {
    const [updated] = await this.drizzleservice.db
      .update(booksTable)
      .set({
        ...data,
      })
      .where(
        and(eq(booksTable.bookId, bookId), eq(booksTable.isDeleted, false)),
      )
      .returning();

    if (!updated) {
      throw new NotFoundException('Book not found');
    }

    return {
      bookId: updated.bookId,
      title: updated.title,
      author: updated.author,
      category: updated.category,
      stock: updated.stock,
      price: updated.price,
      imgUrl: updated.imgUrl ?? undefined,
    };
  }

  async deleteBook(bookId: string): Promise<{ message: string }> {
    const [deleted] = await this.drizzleservice.db
      .delete(booksTable)
      .where(eq(booksTable.bookId, bookId))
      .returning();

    if (!deleted) {
      throw new NotFoundException('Book not found');
    }

    return { message: 'Book Deleted Successfully' };
  }
}
