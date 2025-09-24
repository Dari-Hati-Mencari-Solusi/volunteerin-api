import prisma from '../configs/dbConfig.js';

const notificationSeeder = async () => {
  // Hapus semua notification yang ada
  await prisma.notification.deleteMany({});

  // Ambil beberapa user untuk dijadikan penerima notification
  const users = await prisma.user.findMany({
    select: { id: true, role: true },
    take: 10,
  });

  if (users.length === 0) {
    return;
  }

  // Ambil beberapa event untuk notification url
  const events = await prisma.event.findMany({
    select: { id: true, title: true },
    take: 5,
  });

  const notificationsData = [];

  // Notification untuk setiap user
  users.forEach((user, index) => {
    // Notification welcome
    notificationsData.push({
      userId: user.id,
      content: `Selamat datang di VolunteerIn! Terima kasih telah bergabung dengan platform volunteering terbaik.`,
      type: 'CUSTOM',
      url: '/profile',
      readAt: index % 3 === 0 ? new Date() : null, // Beberapa sudah dibaca
      isDeleted: false,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random dalam 7 hari terakhir
    });

    // Notification sistem
    if (index % 2 === 0) {
      notificationsData.push({
        userId: user.id,
        content:
          'Sistem akan melakukan maintenance pada tanggal 30 Juli 2025 pukul 02:00 WIB.',
        type: 'CUSTOM',
        url: '/maintenance',
        readAt: index % 4 === 0 ? new Date() : null,
        isDeleted: false,
        createdAt: new Date(
          Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000,
        ),
      });
    }

    // Notification event untuk volunteer
    if (user.role === 'VOLUNTEER' && events.length > 0) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      notificationsData.push({
        userId: user.id,
        content: `Event baru "${randomEvent.title}" telah tersedia! Jangan lewatkan kesempatan untuk bervolunteer.`,
        type: 'EVENT_LAUNCHING',
        url: `/events/${randomEvent.id}`,
        readAt: index % 5 === 0 ? new Date() : null,
        isDeleted: false,
        createdAt: new Date(
          Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000,
        ),
      });

      // Notification reminder
      if (index % 3 === 0) {
        notificationsData.push({
          userId: user.id,
          content:
            'Jangan lupa untuk mengecek profil Anda dan pastikan informasi terbaru sudah lengkap.',
          type: 'REMINDER',
          url: '/profile/edit',
          readAt: null, // Belum dibaca
          isDeleted: false,
          createdAt: new Date(
            Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000,
          ),
        });
      }
    }

    // Notification untuk partner
    if (user.role === 'PARTNER') {
      notificationsData.push({
        userId: user.id,
        content:
          'Selamat! Event Anda telah disetujui dan akan ditampilkan di platform.',
        type: 'CUSTOM',
        url: '/partner/events',
        readAt: index % 2 === 0 ? new Date() : null,
        isDeleted: false,
        createdAt: new Date(
          Date.now() - Math.random() * 4 * 24 * 60 * 60 * 1000,
        ),
      });

      // Update notification
      if (index % 4 === 0) {
        notificationsData.push({
          userId: user.id,
          content:
            'Fitur baru telah ditambahkan: Analitik event untuk melihat statistik partisipasi.',
          type: 'EVENT_UPDATE',
          url: '/partner/analytics',
          readAt: null,
          isDeleted: false,
          createdAt: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000), // Random dalam 6 jam
        });
      }
    }

    // Beberapa notification yang sudah di-close/delete
    if (index % 6 === 0) {
      notificationsData.push({
        userId: user.id,
        content: 'Notification ini sudah tidak relevan dan telah ditutup.',
        type: 'CUSTOM',
        url: '/info',
        readAt: new Date(),
        isDeleted: true, // Sudah di-close
        createdAt: new Date(
          Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
        ),
      });
    }
  });

  // Insert notifications
  const createdNotifications = await prisma.notification.createMany({
    data: notificationsData,
  });

  // Log summary
  const summary = await prisma.notification.groupBy({
    by: ['type'],
    _count: {
      type: true,
    },
  });

  const unreadCount = await prisma.notification.count({
    where: {
      readAt: null,
      isDeleted: false,
    },
  });

  return {
    total: createdNotifications.count,
    summary,
    unreadCount,
  };
};

export default notificationSeeder;
