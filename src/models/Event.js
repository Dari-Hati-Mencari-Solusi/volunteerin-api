import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

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

export const createEvent = async (eventData) => {
  try {
    const event = await prisma.event.create({
      data: {
        ...eventData,
        categories: {
          create: eventData.categories.map((categoryId) => ({
            categoryId: categoryId,
          })),
        },
      },
      include: {
        categories: true,
        user: true,
      },
    });
    return event;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new HttpError('User sudah memiliki event yang terdaftar', 400);
    }
    throw error;
  }
};
