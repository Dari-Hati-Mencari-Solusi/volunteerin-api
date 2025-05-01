import prisma from '../configs/dbConfig.js';

export const getAllEventBenefits = async (query = {}) => {
  const { page = 1, limit = 10, search = '' } = query;

  const skip = (page - 1) * limit;

  let whereClause = {};

  if (search) {
    whereClause = {
      OR: [
        { benefit: { name: { contains: search, mode: 'insensitive' } } },
        { benefit: { icon: { contains: search, mode: 'insensitive' } } },
      ],
    };
  }

  const total = await prisma.eventBenefit.count({
    where: whereClause,
  });

  const eventBenefits = await prisma.eventBenefit.findMany({
    where: whereClause,
    include: {
      event: true,
      benefit: true,
    },
    skip,
    take: parseInt(limit),
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return {
    eventBenefits,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEventBenefitById = async (id) => {
  return prisma.eventBenefit.findUnique({
    where: { id },
    include: {
      event: true,
      benefit: true,
    },
  });
};

export const createEventBenefit = async (eventBenefitData) => {
  return prisma.eventBenefit.create({
    data: eventBenefitData,
  });
};

export const updateEventBenefit = async (id, eventBenefitData) => {
  return prisma.eventBenefit.update({
    where: { id },
    data: eventBenefitData,
  });
};

export const deleteEventBenefit = async (id) => {
  return prisma.eventBenefit.delete({
    where: { id },
  });
};
