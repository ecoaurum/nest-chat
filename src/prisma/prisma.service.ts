import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // console.log('DATABASE_URL is:', process.env.DATABASE_URL);
    // 1. Создаем пул соединений PostgreSQL
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Это нужно для Render, чтобы принять их сертификат
      },
    });

    // 2. Создаем адаптер Prisma
    const adapter = new PrismaPg(pool);

    // 3. Передаем адаптер в конструктор родителя
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
