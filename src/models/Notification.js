import prisma from '../configs/dbConfig.js';
import { HttpError } from '../utils/error.js';

export const getNotificationsByUserId = async (userId, query = {}) => {
  const { page = 1, limit = 10, read } = query;

  const skip = (page - 1) * limit;

  let whereClause = {
    userId,
    isDeleted: false,
  };

  // Filter berdasarkan status read/unread
  if (read !== undefined) {
    whereClause = {
      ...whereClause,
      readAt: read === 'true' ? { not: null } : null,
    };
  }

  const total = await prisma.notification.count({
    where: whereClause,
  });

  const notifications = await prisma.notification.findMany({
    where: whereClause,
    select: {
      id: true,
      content: true,
      type: true,
      url: true,
      readAt: true,
      createdAt: true,
      updatedAt: true,
    },
    skip,
    take: parseInt(limit),
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    notifications,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getNotificationById = async (id) => {
  return prisma.notification.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      content: true,
      type: true,
      url: true,
      readAt: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateNotificationStatus = async (id, userId, action) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });

    if (!notification) {
      throw new HttpError('Notifikasi tidak ditemukan', 404);
    }

    let updateData = { updatedAt: new Date() };

    switch (action) {
      case 'read':
        if (notification.readAt) {
          throw new HttpError('Notifikasi sudah dibaca sebelumnya', 400);
        }
        updateData.readAt = new Date();
        break;

      case 'close':
        updateData.isDeleted = true;
        // Jika belum dibaca, tandai juga sebagai dibaca saat close
        if (!notification.readAt) {
          updateData.readAt = new Date();
        }
        break;

      default:
        throw new HttpError(
          'Action tidak valid. Gunakan "read" atau "close"',
          400,
        );
    }

    return prisma.notification.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        content: true,
        type: true,
        url: true,
        readAt: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new HttpError('Notifikasi tidak ditemukan', 404);
    }
    throw error;
  }
};

export const getUnreadNotificationCount = async (userId) => {
  return prisma.notification.count({
    where: {
      userId,
      readAt: null,
      isDeleted: false,
    },
  });
};

export const markAllNotificationsAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null,
      isDeleted: false,
    },
    data: {
      readAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return result;
};
