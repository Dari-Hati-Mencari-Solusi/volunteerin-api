import prisma from '../configs/dbConfig.js';

export const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (email, role = null) => {
  const query = { email };
  if (role) query.role = role;

  return prisma.user.findFirst({ where: query });
};

export const getUserByPhoneNumber = async (phoneNumber) => {
  return prisma.user.findUnique({ where: { phoneNumber } });
};

export const getUserByEmailandPassword = async (
  email,
  password,
  role = 'VOLUNTEER',
) => {
  return prisma.user.findFirst({ where: { email, password, role } });
};

export const createUser = async (data) => {
  return prisma.user.create({ data });
};

export const createUsers = async (data) => {
  return prisma.user.createMany({ data });
};
