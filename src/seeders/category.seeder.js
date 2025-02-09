import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categories = [
  {
    name: 'Musik',
    description: 'Event-event seputar musik dan konser',
  },
  {
    name: 'Olahraga',
    description: 'Event olahraga dan aktivitas fisik',
  },
  {
    name: 'Teknologi',
    description: 'Event teknologi, workshop, dan hackathon',
  },
  {
    name: 'Pendidikan',
    description: 'Event edukasi dan seminar pembelajaran',
  },
  {
    name: 'Seni & Budaya',
    description: 'Event seni, pameran, dan pertunjukan budaya',
  },
];

const seedCategories = async () => {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });
};

export default seedCategories;
