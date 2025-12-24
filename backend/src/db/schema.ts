import { relations } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/pg-core';
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRolesConst = ['ADMIN', 'USER'] as const;
export type UserRolesEnumType = (typeof userRolesConst)[number];
export const UserTypeDbEnum = pgEnum('user_type', userRolesConst);

const createdAt = timestamp('created_at').defaultNow().notNull();
const updatedAt = timestamp('updated_at')
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull();
const deletedAt = timestamp('deleted_at');
const isDeleted = boolean('is_deleted').default(false);

export const baseTableColumns = {
  createdAt,
  updatedAt,
};

export const baseDeleteColumns = {
  deletedAt,
  isDeleted,
};

// User Model

export const userTable = pgTable('users', {
  userId: uuid('user_id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password').notNull(),
  userType: UserTypeDbEnum('user_type').default('USER').notNull(),
  ...baseTableColumns,
  ...baseDeleteColumns,
});

//Book  Model
export const booksTable = pgTable('books', {
  bookId: uuid('book_id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  imgUrl: varchar('image_url', { length: 500 }),
  ...baseTableColumns,
  ...baseDeleteColumns,
});

// Cart Model

export const cartTable = pgTable(
  'cart',
  {
    cartId: uuid('cart_id').primaryKey().defaultRandom(),
    quantity: integer('quantity').notNull().default(1),
    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.userId, {
        onDelete: 'cascade',
      }),
    bookId: uuid('book_id')
      .notNull()
      .references(() => booksTable.bookId, { onDelete: 'cascade' }),

    ...baseTableColumns,
    ...baseDeleteColumns,
  },
  (table) => [
    uniqueIndex('cart_user_book_unique').on(table.userId, table.bookId),
  ],
);

export const cartTableRealtion = relations(cartTable, ({ one }) => ({
  user: one(userTable, {
    fields: [cartTable.userId],
    references: [userTable.userId],
  }),
  book: one(booksTable, {
    fields: [cartTable.bookId],
    references: [booksTable.bookId],
  }),
}));
