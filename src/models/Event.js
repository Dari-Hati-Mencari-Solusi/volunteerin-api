import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

export const addEventBenefits = async (eventId, benefitIds) => {
  const eventBenefitData = benefitIds.map((benefitId) => ({
    eventId,
    benefitId,
  }));

  await prisma.userEventBenefit.createMany({
    data: eventBenefitData,
  });

  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      categories: true,
      userEventBenefit: {
        include: {
          eventBenefit: true,
        },
      },
    },
  });
};

export const updateEventBenefits = async (eventId, benefitIds) => {
  // Hapus semua benefit yang ada terlebih dahulu
  await prisma.userEventBenefit.deleteMany({
    where: {
      eventId,
    },
  });

  // Tambahkan benefit baru
  const eventBenefitData = benefitIds.map((benefitId) => ({
    eventId,
    benefitId,
  }));

  await prisma.userEventBenefit.createMany({
    data: eventBenefitData,
  });

  return true;
};

export const getAllEvents = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    name = '',
    category = '',
    start,
    end,
    publish,
  } = query;

  const skip = (page - 1) * limit;

  let whereClause = {};

  if (name) {
    whereClause = {
      ...whereClause,
      title: {
        contains: name,
        mode: 'insensitive',
      },
    };
  }

  if (category) {
    whereClause = {
      ...whereClause,
      categories: {
        some: {
          name: {
            contains: category,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  if (start) {
    whereClause = {
      ...whereClause,
      startAt: {
        gte: new Date(start),
      },
    };
  }

  if (end) {
    whereClause = {
      ...whereClause,
      endAt: {
        lte: new Date(end),
      },
    };
  }

  if (publish !== undefined) {
    whereClause = {
      ...whereClause,
      isRelease: publish === '1',
    };
  }

  const total = await prisma.event.count({
    where: whereClause,
  });

  const events = await prisma.event.findMany({
    where: whereClause,
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
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

export const getEventsByUserId = async (userId, query = {}) => {
  const {
    page = 1,
    limit = 10,
    name = '',
    category = '',
    start,
    end,
    publish,
  } = query;

  const skip = (page - 1) * limit;

  let whereClause = {
    userId,
  };

  if (name) {
    whereClause = {
      ...whereClause,
      title: {
        contains: name,
        mode: 'insensitive',
      },
    };
  }

  if (category) {
    whereClause = {
      ...whereClause,
      categories: {
        some: {
          name: {
            contains: category,
            mode: 'insensitive',
          },
        },
      },
    };
  }

  if (start) {
    whereClause = {
      ...whereClause,
      startAt: {
        gte: new Date(start),
      },
    };
  }

  if (end) {
    whereClause = {
      ...whereClause,
      endAt: {
        lte: new Date(end),
      },
    };
  }

  if (publish !== undefined) {
    whereClause = {
      ...whereClause,
      isRelease: publish === '1',
    };
  }

  const total = await prisma.event.count({
    where: whereClause,
  });

  const events = await prisma.event.findMany({
    where: whereClause,
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
      userEventBenefit: {
        include: {
          eventBenefit: true,
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
    where: { id },
    include: {
      categories: true,
      userEventBenefit: {
        include: {
          eventBenefit: true,
        },
      },
    },
  });
};

export const createEvent = async (data) => {
  const event = await prisma.event.create({
    data: {
      ...data,
      categories: {
        connect: data.categoryIds?.map((id) => ({ id })) || [],
      },
    },
    include: {
      categories: true,
    },
  });
  return event;
};

export const updateEventById = async (id, data) => {
  const categoryIds = data.categoryIds;
  delete data.categoryIds;

  let updateData = { ...data };

  if (categoryIds && categoryIds.length > 0) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { categories: true },
    });

    updateData.categories = {
      disconnect: event.categories.map((cat) => ({ id: cat.id })),
      connect: categoryIds.map((catId) => ({ id: catId })),
    };
  }

  return prisma.event.update({
    where: { id },
    data: updateData,
    include: {
      categories: true,
    },
  });
};

export const deleteEvent = async (id) => {
  try {
    await prisma.event.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new HttpError('Event tidak ditemukan', 404);
    }
    throw error;
  }
};
