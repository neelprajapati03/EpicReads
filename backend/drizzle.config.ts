// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';
import configuration from 'src/config/configuration';

console.log('\x1b[36m%s\x1b[0m', 'Database URL:', configuration().database.url);

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: configuration().database.url,
    ssl: true,
  },
  migrations: {
    table: '__drizzle_migrations', // `__drizzle_migrations` by default
    schema: 'drizzle', // used in PostgreSQL only, `drizzle` by default
  },
  strict: true,
  verbose: true,
});
