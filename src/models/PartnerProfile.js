import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

export const getAllPartnerProfiles = async (query = {}) => {
  const { page = 1, limit = 10, search = '', status } = query;

  const skip = (page - 1) * limit;

  let whereClause = {};

  if (search) {
    whereClause = {
      OR: [
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          instagram: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          organizationAddress: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }

  const total = await prisma.partnerProfile.count({
    where: whereClause,
  });

  const partnerProfiles = await prisma.partnerProfile.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      responsiblePersons: true,
    },
    skip,
    take: parseInt(limit),
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return {
    partnerProfiles,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPartnerProfiles = async () => {
  return prisma.partnerProfile.findMany();
}

export const getPartnerProfileById = async (id) => {
  return prisma.partnerProfile.findUnique({
    where: { id },
  });
};

export const getPartnerProfileByUserId = async (userId) => {
  return prisma.partnerProfile.findUnique({
    where: { userId },
  });
};

export const createPartnerProfile = async (data) => {
  const partnerProfile = await prisma.partnerProfile.create({ data });
  return partnerProfile;
};

export const updatePartnerProfileByUserId = async (userId, data) => {
  return prisma.partnerProfile.update({
    where: { userId },
    data
  });
}

export const deletePartnerProfile = async (id) => {
  try {
    await prisma.partnerProfile.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new HttpError('Profile partner tidak ditemukan', 404);
    }
    throw error;
  }
};
