import prisma from '../configs/dbConfig.js';

export const getAllEvents = async (query = {}) => {
  const { page = 1, limit = 10, search = '' } = query;
  const skip = (page - 1) * limit;

  return prisma.event.findMany({
    where: {
      title: {
        contains: search,
        mode: 'insensitive',
      },
    },
    include: {
      categories: true,
    },
    skip,
    take: limit,
  });
};

export const createEvent = async (data) => {
  return prisma.event.create({
    data: {
      ...data,
      categories: {
        connect: data.categories.map((id) => ({ id })),
      },
    },
    include: {
      categories: true,
    },
  });
};
