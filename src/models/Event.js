import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

export const getAllEvents = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    location = '',
    categoryId,
    startDate,
    endDate,
    latitude,
    longitude,
    radius = 10,
  } = query;

  const skip = (page - 1) * limit;

  let whereClause = {
    AND: [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ],
  };

  if (location) {
    whereClause.AND.push({
      location: {
        contains: location,
        mode: 'insensitive',
      },
    });
  }

  if (categoryId) {
    whereClause.AND.push({
      categories: {
        some: {
          id: parseInt(categoryId),
        },
      },
    });
  }

  if (startDate || endDate) {
    const dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    whereClause.AND.push({ startAt: dateFilter });
  }

  if (latitude && longitude) {
    const latDegree = radius / 111.12;
    const lonDegree = radius / (111.12 * Math.cos((latitude * Math.PI) / 180));

    whereClause.AND.push({
      AND: [
        { latitude: { gte: Number(latitude) - latDegree } },
        { latitude: { lte: Number(latitude) + latDegree } },
        { longitude: { gte: Number(longitude) - lonDegree } },
        { longitude: { lte: Number(longitude) + lonDegree } },
      ],
    });
  }

  const total = await prisma.event.count({
    where: whereClause,
  });

  const events = await prisma.event.findMany({
    where: whereClause,
    include: {
      categories: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    skip,
    take: parseInt(limit),
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    events,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventById = async (id) => {
  return prisma.event.findUnique({
    where: { id: parseInt(id) },
    include: {
      categories: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
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
