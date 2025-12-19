import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

import * as schema from './schema';
import { ConfigType } from 'src/config/configuration';

@Injectable()
export class DrizzleService implements OnModuleInit {
  private _drizzle: ReturnType<typeof drizzle<typeof schema, Pool>>;
  private connectionString: string;
  private readonly serverEnvironment: ConfigType['serverEnvironment'];

  constructor(
    private readonly configService: ConfigService<{
      'database.url': string;
      serverEnvironment: ConfigType['serverEnvironment'];
    }>,
  ) {
    this.connectionString =
      this.configService.getOrThrow<string>('database.url');
    this.serverEnvironment = configService.getOrThrow('serverEnvironment');
  }

  private logger = new Logger('DrizzleService');

  async onModuleInit() {
    if (!this._drizzle) {
      this.logger.verbose('Connecting to database...');
      const pool = new Pool({
        connectionString: this.connectionString,
        ssl: this.connectionString.includes('sslmode=no-verify')
          ? {
              rejectUnauthorized: false,
            }
          : false,
      });
      try {
        await pool.query('SELECT 1').then(() => {
          this.logger.verbose('Connected to database');
        });
      } catch (error) {
        console.error('Failed to connect to database');
        console.error(error); // Propagate the error
        throw error;
      }

      this._drizzle = drizzle({ client: pool, schema });
    }
  }

  get db() {
    return this._drizzle;
  }
}
