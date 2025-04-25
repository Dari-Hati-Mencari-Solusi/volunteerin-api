import prisma from '../configs/dbConfig.js';

export const getAllUserEventBenefits = async (query = {}) => {
  const { page = 1, limit = 10, search = '' } = query;

  const skip = (page - 1) * limit;

  let whereClause = {};

  if (search) {
    whereClause = {
      OR: [
        { customIcon: { contains: search, mode: 'insensitive' } },
        { customBenefit: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  const total = await prisma.userEventBenefit.count({
    where: whereClause,
  });

  const userEventBenefits = await prisma.userEventBenefit.findMany({
    where: whereClause,
    include: {
      user: true,
      event: true,
    },
    skip,
    take: parseInt(limit),
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return {
    userEventBenefits,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserEventBenefitById = async (id) => {
  return prisma.userEventBenefit.findUnique({
    where: { id },
    include: {
      user: true,
      event: true,
    },
  });
};

export const createUserEventBenefit = async (userEventBenefitData) => {
  return prisma.userEventBenefit.create({
    data: userEventBenefitData,
  });
};

export const updateUserEventBenefit = async (id, userEventBenefitData) => {
  return prisma.userEventBenefit.update({
    where: { id },
    data: userEventBenefitData,
  });
};

export const deleteUserEventBenefit = async (id) => {
  return prisma.userEventBenefit.delete({
    where: { id },
  });
};
