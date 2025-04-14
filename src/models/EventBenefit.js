import prisma from '../configs/dbConfig.js';

export const createEventBenefit = async (data) => {
  const eventBenefit = await prisma.eventBenefit.create({ data });
  return eventBenefit;
};

export const getAllEventBenefits = async () => {
  return prisma.eventBenefit.findMany();
};

export const updateEventBenefit = async (id, data) => {
  return prisma.eventBenefit.update({
    where: { id },
    data,
  });
};

export const deleteEventBenefit = async (id) => {
  try {
    await prisma.eventBenefit.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('EventBenefit tidak ditemukan');
    }
    throw error;
  }
};
