import prisma from '../configs/dbConfig.js';
import { createBenefit } from '../models/Benefit.js';

// Fungsi untuk membuat data benefit berdasarkan user yang tersedia
const seedBenefits = async () => {
  // Ambil beberapa user dari database
  const users = await prisma.user.findMany({
    take: 3, // Ambil 3 user pertama
    select: {
      id: true,
    },
  });

  if (users.length === 0) {
    console.log(
      'Tidak ada user yang ditemukan. Jalankan user seeder terlebih dahulu.',
    );
    return;
  }

  // Template benefit untuk setiap user
  const benefitTemplates = [
    {
      name: 'Sertifikat',
      icon: 'certificate',
      description: 'Dapatkan sertifikat resmi keikutsertaan',
    },
    {
      name: 'Konsumsi',
      icon: 'food',
      description: 'Makan dan minum gratis selama kegiatan',
    },
    {
      name: 'Transportasi',
      icon: 'car',
      description: 'Bantuan biaya transportasi',
    },
    {
      name: 'Merchandise',
      icon: 'gift',
      description: 'Dapatkan merchandise ekslusif',
    },
    {
      name: 'Pelatihan',
      icon: 'training',
      description: 'Mendapatkan pelatihan khusus',
    },
    {
      name: 'Jaringan',
      icon: 'network',
      description: 'Kesempatan networking dengan profesional',
    },
    {
      name: 'Akomodasi',
      icon: 'hotel',
      description: 'Akomodasi disediakan bagi peserta dari luar kota',
    },
    {
      name: 'Penghargaan',
      icon: 'award',
      description: 'Penghargaan untuk partisipan terbaik',
    },
  ];

  const benefits = [];

  // Distribusikan benefit template ke user yang ada
  // User pertama mendapat 4 benefit pertama
  for (let i = 0; i < 4; i++) {
    if (users[0]) {
      benefits.push({
        ...benefitTemplates[i],
        userId: users[0].id,
        createdAt: new Date(),
      });
    }
  }

  // User kedua mendapat 2 benefit berikutnya
  for (let i = 4; i < 6; i++) {
    if (users[1]) {
      benefits.push({
        ...benefitTemplates[i],
        userId: users[1].id,
        createdAt: new Date(),
      });
    }
  }

  // User ketiga mendapat 2 benefit terakhir
  for (let i = 6; i < 8; i++) {
    if (users[2]) {
      benefits.push({
        ...benefitTemplates[i],
        userId: users[2].id,
        createdAt: new Date(),
      });
    }
  }

  // Buat benefit di database
  for (const benefit of benefits) {
    await createBenefit(benefit);
    // console.log(`Benefit "${benefit.name}" untuk user ID ${benefit.userId} berhasil dibuat`);
  }
};

export default async () => {
  try {
    await seedBenefits();
    console.log('Data benefit berhasil di-seed.');
  } catch (error) {
    console.error('Error saat seeding benefit:', error);
  }
};
