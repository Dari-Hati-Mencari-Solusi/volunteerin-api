import prisma from '../configs/dbConfig.js';

export const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (email) => {
  return prisma.user.findFirst({ where: { email } });
};

export const getUserByPhoneNumber = async (phoneNumber) => {
  return prisma.user.findUnique({ where: { phoneNumber } });
};

export const createUser = async (data) => {
  return prisma.user.create({ data });
};

export const createUsers = async (data) => {
  return prisma.user.createMany({ data });
};

export const verifyUser = async (id) => {
  const now = new Date();

  return prisma.user.update({
    where: { id },
    data: {
      verifiedAt: now,
      updatedAt: now,
    },
  });
};

export const updatePassword = async (id, password) => {
  const now = new Date();

  return prisma.user.update({
    where: { id },
    data: {
      password,
      updatedAt: now,
    },
  });
};

export const logUserLogin = async (id) => {
  const now = new Date();

  return prisma.user.update({
    where: { id },
    data: {
      lastLoginAt: now,
      updatedAt: now,
    },
  });
};
