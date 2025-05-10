import prisma from '../configs/dbConfig.js';
import { filterAllowedRelation } from '../utils/object.js';

export const getUsers = async ({s: search, role, page, limit, sort}) => {
  role = role?.toUpperCase(role);
  
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  sort = sort || 'desc';
  const skip = (page - 1) * limit;


  const where = {
    ...(role?.trim() && { role }),
    ...(search?.trim() && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    })
  }


  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: sort }
    }),
    prisma.user.count({ 
      where,
      skip,
      take: limit 
    })
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems,
    data: users,
  }
}

export const getUserById = async (id, includeWith = {}) => {
  const allowedRelations = ['profile', 'partner', 'benefit'];
  includeWith = filterAllowedRelation(includeWith, allowedRelations)

  return prisma.user.findUnique({ 
    where: { id },
    include: includeWith
  });
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

export const updateUserById = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};