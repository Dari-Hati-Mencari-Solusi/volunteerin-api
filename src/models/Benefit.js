import prisma from '../configs/dbConfig.js';

export const createBenefit = async (data) => {
  try {
    if (!prisma) {
      throw new Error('Prisma client tidak terdefinisi');
    }

    if (!prisma.benefit) {
      throw new Error('Model benefit tidak terdefinisi di Prisma Client');
    }

    const benefit = await prisma.benefit.create({ data });
    return benefit;
  } catch (error) {
    console.error('Error di createBenefit:', error);
    throw error;
  }
};
export const getAllBenefits = async () => {
  return prisma.benefit.findMany();
};

export const getBenefitsByUserId = async (userId) => {
  return prisma.benefit.findMany({
    where: { userId },
  });
};

export const updateBenefit = async (id, data) => {
  return prisma.benefit.update({
    where: { id },
    data,
  });
};

export const deleteBenefit = async (id) => {
  try {
    await prisma.benefit.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Benefit tidak ditemukan');
    }
    throw error;
  }
};
