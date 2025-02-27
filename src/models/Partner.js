import prisma from '../configs/dbConfig.js';

export const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};
