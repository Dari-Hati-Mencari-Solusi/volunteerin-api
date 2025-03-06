import * as categoryModel from '../models/Category.js';
import { HttpError } from '../utils/error.js';
import prisma from '../configs/dbConfig.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const result = await categoryModel.getAllCategories(req.query);

    if (!result.categories.length) {
      throw new HttpError('Tidak ada kategori yang ditemukan', 404);
    }

    res.status(200).json({
      message: 'Daftar kategori berhasil diambil',
      data: result.categories,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new HttpError('ID kategori tidak valid', 400);
    }

    const category = await categoryModel.getCategoryById(parseInt(id));

    if (!category) {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Kategori berhasil diambil',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { validatedCategoryData } = req;

    // Cek apakah kategori dengan nama yang sama sudah ada
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: validatedCategoryData.name,
          mode: 'insensitive',
        },
      },
    });

    if (existingCategory) {
      throw new HttpError('Kategori dengan nama tersebut sudah ada', 400);
    }

    const category = await categoryModel.createCategory(validatedCategoryData);

    res.status(201).json({
      message: 'Kategori berhasil dibuat',
      data: category,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error creating category:', error);
    }
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { validatedCategoryData } = req;

    if (!id || isNaN(id)) {
      throw new HttpError('ID kategori tidak valid', 400);
    }

    const parsedId = parseInt(id);

    // Cek apakah kategori ada
    const existingCategory = await categoryModel.getCategoryById(parsedId);

    if (!existingCategory) {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }

    // Cek apakah nama kategori sudah digunakan oleh kategori lain
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: validatedCategoryData.name,
          mode: 'insensitive',
        },
        id: {
          not: parsedId,
        },
      },
    });

    if (duplicateCategory) {
      throw new HttpError('Kategori dengan nama tersebut sudah ada', 400);
    }

    const category = await categoryModel.updateCategory(
      parsedId,
      validatedCategoryData,
    );

    res.status(200).json({
      message: 'Kategori berhasil diperbarui',
      data: category,
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error updating category:', error);
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      throw new HttpError('ID kategori tidak valid', 400);
    }

    const parsedId = parseInt(id);

    // Cek apakah kategori ada
    const existingCategory = await categoryModel.getCategoryById(parsedId);

    if (!existingCategory) {
      throw new HttpError('Kategori tidak ditemukan', 404);
    }

    // Cek apakah kategori digunakan oleh event
    const eventCount = await prisma.event.count({
      where: {
        categories: {
          some: {
            id: parsedId,
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

    await categoryModel.deleteCategory(parsedId);

    res.status(200).json({
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    if (!(error instanceof HttpError)) {
      console.error('Error deleting category:', error);
    }
    next(error);
  }
};
