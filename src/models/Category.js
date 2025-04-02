import prisma from '../configs/dbConfig.js';

export const getAllCategories = async (query = {}) => {
  const { page = 1, limit = 10, search = '' } = query;

  const skip = (page - 1) * limit;

  let whereClause = {};

  if (search) {
    whereClause = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };
  }

  const total = await prisma.category.count({
    where: whereClause,
  });

  const categories = await prisma.category.findMany({
    where: whereClause,
    skip,
    take: parseInt(limit),
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return {
    categories,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCategories = async () => {
  return prisma.category.findMany();
}

export const getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const createCategory = async (categoryData) => {
  return prisma.category.create({
    data: categoryData,
  });
};

export const createCategories = async (data) => {
  return prisma.category.createMany({
    data
  });
}

export const updateCategory = async (id, categoryData) => {
  return prisma.category.update({
    where: { id },
    data: categoryData,
  });
};

export const deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id },
  });
};
