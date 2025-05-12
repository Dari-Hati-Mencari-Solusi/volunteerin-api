import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

// No filtering
export const getEvents = async () => {
  return prisma.event.findMany();
} 

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

  let whereClause = {
    isRelease: true,
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
      benefits: {
        select: {
          id: true,
          name: true,
          icon: true,
          description: true,
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
    isRelease: true,
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
    whereClause.isRelease = publish === '1';
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
      benefits: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          avatarUrl: true,
          isSubscribed: true,
          partner: {
            select: {
              instagram: true,
              organizationType: true,
              organizationAddress: true,
              status: true,
            },
          },
        },
      },
    },
  });
};

export const createEvent = async (data) => {
  try {
    const { categoryIds, benefitIds, ...eventData } = data;

    const event = await prisma.event.create({
      data: {
        ...eventData,
        maxApplicant: eventData.maxApplicant
          ? Number(eventData.maxApplicant)
          : null,
        acceptedQuota: eventData.acceptedQuota
          ? Number(eventData.acceptedQuota)
          : null,
        isPaid:
          typeof eventData.isPaid === 'string'
            ? eventData.isPaid === 'true'
            : !!eventData.isPaid,
        price: eventData.price ? Number(eventData.price) : 0,
        latitude: eventData.latitude ? Number(eventData.latitude) : null,
        longitude: eventData.longitude ? Number(eventData.longitude) : null,
        isRelease:
          typeof eventData.isRelease === 'string'
            ? eventData.isRelease === 'true'
            : !!eventData.isRelease,
        categories:
          categoryIds && categoryIds.length > 0
            ? {
                connect: categoryIds.map((id) => ({ id })),
              }
            : undefined,
        benefits:
          benefitIds && benefitIds.length > 0
            ? {
                connect: benefitIds.map((id) => ({ id })),
              }
            : undefined,
      },
      include: {
        categories: true,
        benefits: true,
      },
    });

    return {
      ...event,
    };
  } catch (error) {
    if (error.code === 'P2002') {
      throw new HttpError('Event dengan judul tersebut sudah ada', 400);
    }
    throw error;
  }
};

export const updateEventById = async (id, data) => {
  try {
    const { categoryIds, benefitIds, ...updateData } = data;

    let eventUpdate = { ...updateData };

    if (updateData.maxApplicant !== undefined) {
      eventUpdate.maxApplicant = updateData.maxApplicant
        ? Number(updateData.maxApplicant)
        : null;
    }

    if (updateData.acceptedQuota !== undefined) {
      eventUpdate.acceptedQuota = updateData.acceptedQuota
        ? Number(updateData.acceptedQuota)
        : null;
    }

    if (updateData.isPaid !== undefined) {
      eventUpdate.isPaid =
        typeof updateData.isPaid === 'string'
          ? updateData.isPaid === 'true'
          : !!updateData.isPaid;
    }

    if (updateData.price !== undefined) {
      eventUpdate.price = updateData.price ? Number(updateData.price) : 0;
    }

    if (updateData.latitude !== undefined) {
      eventUpdate.latitude = updateData.latitude
        ? Number(updateData.latitude)
        : null;
    }

    if (updateData.longitude !== undefined) {
      eventUpdate.longitude = updateData.longitude
        ? Number(updateData.longitude)
        : null;
    }

    if (updateData.isRelease !== undefined) {
      eventUpdate.isRelease =
        typeof updateData.isRelease === 'string'
          ? updateData.isRelease === 'true'
          : !!updateData.isRelease;
    }

    if (categoryIds && categoryIds.length > 0) {
      const event = await prisma.event.findUnique({
        where: { id },
        include: { categories: true },
      });

      if (event) {
        eventUpdate.categories = {
          disconnect: event.categories.map((cat) => ({ id: cat.id })),
          connect: categoryIds.map((catId) => ({ id: catId })),
        };
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: eventUpdate,
      include: {
        categories: true,
        benefit: true,
      },
    });

    return {
      ...updatedEvent,
      benefitIds: benefitIds,
    };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new HttpError('Event tidak ditemukan', 404);
    }
    throw error;
  }
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
