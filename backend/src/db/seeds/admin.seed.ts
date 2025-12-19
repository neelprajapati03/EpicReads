import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';

import * as schema from '../schema';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@yopmail.com';
const ADMIN_FIRST_NAME = 'Super';
const ADMIN_LAST_NAME = 'Admin';
const ADMIN_PASSWORD = 'admin@123';

async function main() {
  if (
    !process.env.DATABASE_USERNAME ||
    !process.env.DATABASE_PASSWORD ||
    !process.env.DATABASE_HOST ||
    !process.env.DATABASE_PORT ||
    !process.env.DATABASE_NAME
  ) {
    throw new Error('Database environment variables are missing');
  }

  const connectionString = `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running this script',
    );
  }

  console.log(`🔌 Connecting to database`);

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=no-verify')
      ? { rejectUnauthorized: false }
      : false,
  });

  try {
    const db = drizzle(pool, { schema });

    // 1️⃣ Check existing admin
    const existing = await db.query.userTable.findFirst({
      where: eq(schema.userTable.email, ADMIN_EMAIL),
      columns: { userId: true },
    });

    if (existing) {
      console.log(`⚠️ Admin already exists (user_id=${existing.userId})`);
      return;
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // 3️⃣ Create admin
    const [created] = await db
      .insert(schema.userTable)
      .values({
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        userType: 'ADMIN', // ✅ explicitly admin
      })
      .returning({
        userId: schema.userTable.userId,
        email: schema.userTable.email,
      });

    console.log('✅ Admin user created successfully');
    console.log(`   → user_id: ${created.userId}`);
    console.log(`   → email: ${created.email}`);
  } catch (error) {
    console.error('❌ Failed to seed admin', error);
    process.exitCode = 1;
  } finally {
    await pool.end(); // ✅ important
    console.log('🔒 Database connection closed');
  }
}

main();
