import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

prisma.$extends({
  result: {
    $allModels: {
      hash_id: {
        compute({ id }) {
          return crypto.createHash('sha256').update(String(id)).digest('hex');
        },
      },
    },
  },
});

export default prisma;
