import prisma from '../configs/dbConfig.js';

export const createLegality = async (data) => {
  return prisma.legality.create({ data });
}