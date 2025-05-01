// models/eventBenefit.js
import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

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
      createdAt: 'desc',
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

export const getEventBenefitsByEventId = async (eventId) => {
  return prisma.eventBenefit.findMany({
    where: { eventId },
    include: {
      benefit: true,
    },
  });
};

export const createEventBenefit = async (data) => {
  try {
    // Validasi input data
    if (!data || !data.eventId || !data.benefitId) {
      throw new HttpError('Data relasi event dan benefit tidak lengkap', 400);
    }

    // Buat relasi
    return await prisma.eventBenefit.create({
      data: {
        eventId: data.eventId,
        benefitId: data.benefitId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        benefit: true,
      },
    });
  } catch (error) {
    console.error('Error creating event benefit:', error);
    if (error instanceof HttpError) {
      throw error;
    }
    if (error.code === 'P2002') {
      throw new HttpError('Relasi antara event dan benefit sudah ada', 400);
    }
    throw new HttpError('Gagal membuat relasi event dan benefit', 500);
  }
};

export const updateEventBenefit = async (id, data) => {
  try {
    return await prisma.eventBenefit.update({
      where: { id },
      data: {
        eventId: data.eventId,
        benefitId: data.benefitId,
        updatedAt: new Date(),
      },
      include: {
        benefit: true,
      },
    });
  } catch (error) {
    console.error('Error updating event benefit:', error);
    if (error.code === 'P2002') {
      throw new HttpError('Relasi antara event dan benefit sudah ada', 400);
    }
    throw new HttpError('Gagal memperbarui relasi event dan benefit', 500);
  }
};

export const deleteEventBenefit = async (id) => {
  try {
    return await prisma.eventBenefit.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting event benefit:', error);
    if (error.code === 'P2025') {
      throw new HttpError('Relasi event dan benefit tidak ditemukan', 404);
    }
    throw new HttpError('Gagal menghapus relasi event dan benefit', 500);
  }
};

export const deleteEventBenefitsByEventId = async (eventId) => {
  try {
    return await prisma.eventBenefit.deleteMany({
      where: { eventId },
    });
  } catch (error) {
    console.error('Error deleting event benefits by event id:', error);
    throw new HttpError('Gagal menghapus relasi event dan benefit', 500);
  }
};

export const createEventBenefits = async (eventId, benefitIds) => {
  if (!benefitIds || benefitIds.length === 0) {
    return [];
  }

  try {
    const eventBenefitData = benefitIds.map((benefitId) => ({
      eventId,
      benefitId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await prisma.eventBenefit.createMany({
      data: eventBenefitData,
    });

    return getEventBenefitsByEventId(eventId);
  } catch (error) {
    console.error('Error creating multiple event benefits:', error);
    throw new HttpError('Gagal menambahkan manfaat ke event', 500);
  }
};

export const updateEventBenefits = async (eventId, benefitIds) => {
  try {
    // Hapus semua benefit yang ada terlebih dahulu
    await prisma.eventBenefit.deleteMany({
      where: {
        eventId,
      },
    });

    if (!benefitIds || benefitIds.length === 0) {
      return [];
    }

    // Tambahkan benefit baru
    return createEventBenefits(eventId, benefitIds);
  } catch (error) {
    console.error('Error updating event benefits:', error);
    throw new HttpError('Gagal memperbarui manfaat event', 500);
  }
};
