import * as notificationModel from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { count_only } = req.query;

    // Jika query count_only=true, return hanya unread count
    if (count_only === 'true') {
      const count = await notificationModel.getUnreadNotificationCount(userId);
      return res.status(200).json({
        message: 'Berhasil mendapatkan jumlah notifikasi yang belum dibaca',
        data: { count },
      });
    }

    // Return daftar notifikasi normal
    const result = await notificationModel.getNotificationsByUserId(
      userId,
      req.query,
    );

    if (!result.notifications.length) {
      return res.status(404).json({
        message: 'Tidak ada notifikasi yang ditemukan',
      });
    }

    res.status(200).json({
      message: 'Daftar notifikasi berhasil diambil',
      data: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const notification = await notificationModel.getNotificationById(id);

    if (!notification) {
      return res.status(404).json({
        message: 'Notifikasi tidak ditemukan',
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        message: 'Anda tidak memiliki akses untuk notifikasi ini',
      });
    }

    if (notification.isDeleted) {
      return res.status(404).json({
        message: 'Notifikasi tidak ditemukan',
      });
    }

    res.status(200).json({
      message: 'Berhasil mendapatkan data notifikasi',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotificationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'read' atau 'close'
    const { id: userId } = req.user;

    if (!action || !['read', 'close'].includes(action)) {
      return res.status(400).json({
        message: 'Action tidak valid. Gunakan "read" atau "close"',
      });
    }

    const notification = await notificationModel.updateNotificationStatus(
      id,
      userId,
      action,
    );

    const message =
      action === 'read'
        ? 'Notifikasi berhasil ditandai sebagai dibaca'
        : 'Notifikasi berhasil ditutup';

    res.status(200).json({
      message,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const result = await notificationModel.markAllNotificationsAsRead(userId);

    res.status(200).json({
      message: `Berhasil menandai ${result.count} notifikasi sebagai dibaca`,
      data: { updatedCount: result.count },
    });
  } catch (error) {
    next(error);
  }
};
