import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DrizzleService } from 'src/db/drizzle.service';
import { booksTable, cartTable } from 'src/db/schema';
import { AddToCartDto, UpdateCartDto } from 'src/Dtos/types/Cart.dto';

@Injectable()
export class CartService {
  constructor(private drizzleservice: DrizzleService) {}

  async addCart(userId: string, data: AddToCartDto) {
    if (!data.quantity || data.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }
    const existing = await this.drizzleservice.db.query.cartTable.findFirst({
      where: and(
        eq(cartTable.userId, userId),
        eq(cartTable.bookId, data.bookId),
      ),
    });

    if (existing) {
      const [updated] = await this.drizzleservice.db
        .update(cartTable)
        .set({
          quantity: existing.quantity + data.quantity,
        })
        .where(eq(cartTable.cartId, existing.cartId))
        .returning();

      return updated;
    }
    const [created] = await this.drizzleservice.db
      .insert(cartTable)
      .values({
        userId,
        bookId: data.bookId,
        quantity: data.quantity,
      })
      .returning();

    return created;
  }

  async getCartItems(userId: string) {
    const items = await this.drizzleservice.db
      .select({
        cartId: cartTable.cartId,
        quantity: cartTable.quantity,
        bookId: booksTable.bookId,
        title: booksTable.title,
        author: booksTable.author,
        category: booksTable.category,
        price: booksTable.price,
        imgUrl: booksTable.imgUrl,
      })
      .from(cartTable)
      .innerJoin(booksTable, eq(cartTable.bookId, booksTable.bookId))
      .where(
        and(
          eq(cartTable.userId, userId),
          eq(cartTable.isDeleted, false),
          eq(booksTable.isDeleted, false),
        ),
      )
      .orderBy(desc(cartTable.createdAt));
    const cartItems = items.map((item) => {
      const price = Number(item.price);
      const totalPrice = price * item.quantity;

      return {
        cartId: item.cartId,
        quantity: item.quantity,
        price,
        totalPrice,
        book: {
          bookId: item.bookId,
          title: item.title,
          author: item.author,
          category: item.category,
          imgUrl: item.imgUrl ?? undefined,
        },
      };
    });

    // 2️⃣ Calculate cartTotal
    const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      items: cartItems,
      cartTotal,
    };
  }

  async getCartItemById(userId: string, cartId: string) {
    const items = await this.drizzleservice.db
      .select({
        cartId: cartTable.cartId,
        quantity: cartTable.quantity,
        bookId: booksTable.bookId,
        title: booksTable.title,
        author: booksTable.author,
        category: booksTable.category,
        price: booksTable.price,
        imgUrl: booksTable.imgUrl,
      })
      .from(cartTable)
      .innerJoin(booksTable, eq(cartTable.bookId, booksTable.bookId))
      .where(
        and(
          eq(cartTable.cartId, cartId),
          eq(cartTable.userId, userId),
          eq(cartTable.isDeleted, false),
          eq(booksTable.isDeleted, false),
        ),
      );

    if (!items.length) {
      throw new NotFoundException('Cart item not found');
    }

    const item = items[0];

    const totalPrice = item.quantity * Number(item.price);

    return {
      cartId: item.cartId,
      quantity: item.quantity,
      totalPrice,
      book: {
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        category: item.category,
        price: item.price,
        imgUrl: item.imgUrl ?? undefined,
      },
    };
  }

  async updateCart(userId: string, cartId: string, data: UpdateCartDto) {
    if (!data.quantity || data.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const existing = await this.drizzleservice.db.query.cartTable.findFirst({
      where: and(eq(cartTable.cartId, cartId), eq(cartTable.userId, userId)),
    });

    if (!existing) {
      throw new NotFoundException('CartId not Found');
    }

    const [updated] = await this.drizzleservice.db
      .update(cartTable)
      .set({
        quantity: data.quantity,
      })
      .where(eq(cartTable.cartId, cartId))
      .returning();

    return updated;
  }

  async deleteCartItem(
    userId: string,
    cartId: string,
  ): Promise<{ message: string }> {
    const [deleted] = await this.drizzleservice.db
      .delete(cartTable)
      .where(and(eq(cartTable.cartId, cartId), eq(cartTable.userId, userId)))
      .returning();

    if (!deleted) {
      throw new NotFoundException('Cart item not found');
    }

    return { message: 'Item removed from cart' };
  }
}
