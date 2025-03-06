import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

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

export const getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: { id: parseInt(id) },
  });
};

export const createCategory = async (categoryData) => {
  try {
    const category = await prisma.category.create({
      data: categoryData,
    });

    return category;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new HttpError('Kategori dengan nama tersebut sudah ada', 400);
    }
    console.error('Error creating category:', error);
    throw new HttpError('Gagal membuat kategori', 500);
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: categoryData,
    });

    return category;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new HttpError('Kategori dengan nama tersebut sudah ada', 400);
    }
    if (error.code === 'P2025') {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }
    console.error('Error updating category:', error);
    throw new HttpError('Gagal memperbarui kategori', 500);
  }
};

export const deleteCategory = async (id) => {
  try {
    // Cek apakah kategori digunakan oleh event
    const eventCount = await prisma.event.count({
      where: {
        categories: {
          some: {
            id: id,
          },
        },
      },
    });

    if (eventCount > 0) {
      throw new HttpError(
        'Kategori ini sedang digunakan oleh event, tidak dapat dihapus',
        400,
      );
    }

    await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }
    console.error('Error deleting category:', error);
    throw new HttpError('Gagal menghapus kategori', 500);
  }
};
