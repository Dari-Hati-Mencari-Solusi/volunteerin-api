import prisma from '../configs/dbConfig.js';

export const getAllEvents = async () => {
  return prisma.event.findMany({
    include: {
      categories: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
};
