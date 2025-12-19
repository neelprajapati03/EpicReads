import { ConfigFactory } from '@nestjs/config';

export default (() => ({
  port: parseInt(process.env.PORT ?? '3000', 10),

  database: {
    get url() {
      return `postgresql://${this.user}:${this.password}@${this.host}:${this.port}/${this.dbName}`;
    },
    host: process.env.DATABASE_HOST ?? '',
    dbName: process.env.DATABASE_NAME ?? '',
    port: process.env.DATABASE_PORT ?? '',
    user: process.env.DATABASE_USERNAME ?? '',
    password: process.env.DATABASE_PASSWORD ?? '',
  },

  // Hard-locked environment
  serverEnvironment: 'Development',
})) satisfies ConfigFactory<ConfigType>;

export type ConfigType = {
  port: number;
  database: {
    url: string;
    host: string;
    dbName: string;
    port: string;
    user: string;
    password: string;
  };
  serverEnvironment: 'Development';
};
