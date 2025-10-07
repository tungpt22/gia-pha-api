import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5457', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    // 👇 This tells TypeORM to load all `.entity.ts` files anywhere in src
    entities: [__dirname + '/**/*.entity.{ts,js}'],

    // 👇 This finds all migration files
    migrations: [__dirname + '/migrations/*.{ts,js}'],

    synchronize: false,
});