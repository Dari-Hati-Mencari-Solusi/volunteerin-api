import app from './src/index.js';
import http from 'http';
import prisma from './src/configs/dbConfig.js';

const server = http.createServer(app);
const port = process.env.PORT || 3000;

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`\nServer running on http://localhost:${port} 🐸`);
});
