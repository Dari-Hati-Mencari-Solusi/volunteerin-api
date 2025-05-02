import prisma from '../configs/dbConfig.js';
import { createEvent } from '../models/Event.js';
import slugify from 'slugify';

const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
  });
};

// Fungsi untuk membuat data event berdasarkan user dan kategori yang tersedia
const seedEvents = async () => {
  // Ambil user dari database
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

  // Ambil kategori dari database
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  if (categories.length === 0) {
    console.log(
      'Tidak ada kategori yang ditemukan. Jalankan category seeder terlebih dahulu.',
    );
    return;
  }

  // Ambil benefit dari database
  const benefits = await prisma.benefit.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
    },
  });

  if (benefits.length === 0) {
    console.log(
      'Tidak ada benefit yang ditemukan. Jalankan benefit seeder terlebih dahulu.',
    );
    return;
  }

  // Fungsi helper untuk mendapatkan id kategori berdasarkan nama
  const getCategoryIdByName = (name) => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase(),
    );
    return category ? category.id : null;
  };

  // Fungsi helper untuk mendapatkan benefit milik user tertentu
  const getBenefitsByUserId = (userId) => {
    return benefits
      .filter((benefit) => benefit.userId === userId)
      .map((benefit) => benefit.id);
  };

  // Template event
  const eventTemplates = [
    {
      title: 'Bersih Pantai Kuta',
      type: 'OPEN',
      description:
        'Mari bergabung dalam kegiatan bersih-bersih pantai Kuta untuk menjaga kelestarian lingkungan dan ekosistem laut. Kegiatan ini akan melibatkan pengumpulan sampah plastik dan edukasi mengenai pentingnya menjaga kebersihan pantai.',
      requirement:
        '1. Peserta berusia minimal 17 tahun\n2. Membawa botol minum sendiri\n3. Menggunakan pakaian yang sesuai untuk aktivitas pantai\n4. Bersedia mengikuti briefing keselamatan',
      contactPerson: '081234567890',
      maxApplicant: 50,
      acceptedQuota: 50,
      startAt: new Date(2025, 4, 15, 8, 0), // 15 Mei 2025, 08:00
      endAt: new Date(2025, 4, 15, 12, 0), // 15 Mei 2025, 12:00
      isPaid: false,
      price: 0,
      province: 'Bali',
      regency: 'Kabupaten Badung',
      address: 'Pantai Kuta, Kuta, Badung, Bali',
      gmaps: 'https://maps.google.com/?q=-8.7184,115.1687',
      latitude: -8.7184,
      longitude: 115.1687,
      bannerImageId: 'beach_cleanup_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl1cvI_MS8oxczCxgYZmc1eGlHKeJoi1ES2g&s', // Ganti dengan URL gambar yang sebenarnya
      isRelease: true,
      categoryNames: ['Lingkungan'], // Nama kategori yang akan dikonversi ke ID
      userIndex: 0, // Indeks user dalam array users
    },
    // {
    //   title: 'Workshop Coding untuk Anak Panti Asuhan',
    //   type: 'INVITE',
    //   description:
    //     'Workshop coding dasar untuk memperkenalkan anak-anak panti asuhan pada dunia pemrograman. Peserta akan belajar dasar-dasar HTML, CSS, dan JavaScript melalui aktivitas interaktif dan menyenangkan.',
    //   requirement:
    //     '1. Anak panti asuhan usia 12-18 tahun\n2. Tidak perlu pengalaman coding sebelumnya\n3. Laptop akan disediakan\n4. Wajib mengikuti seluruh sesi workshop',
    //   contactPerson: '087654321098',
    //   maxApplicant: 20,
    //   acceptedQuota: 20,
    //   startAt: new Date(2025, 5, 1, 9, 0), // 1 Juni 2025, 09:00
    //   endAt: new Date(2025, 5, 2, 15, 0), // 2 Juni 2025, 15:00
    //   isPaid: false,
    //   price: 0,
    //   province: 'DKI Jakarta',
    //   regency: 'Jakarta Selatan',
    //   address: 'Panti Asuhan Kasih, Jl. Kemang Raya No. 10, Jakarta Selatan',
    //   gmaps: 'https://maps.google.com/?q=-6.2601,106.8113',
    //   latitude: -6.2601,
    //   longitude: 106.8113,
    //   bannerImageId: 'coding_workshop_banner',
    //   bannerUrl:
    //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGkiwx-o0nVsiErGpBg5-dBp_GIkqyLvK1cw&s', // Ganti dengan URL gambar yang sebenarnya
    //   isRelease: true,
    //   categoryNames: ['Pendidikan', 'Teknologi'],
    //   userIndex: 1,
    // },
    // {
    //   title: 'Donor Darah Massal',
    //   type: 'OPEN',
    //   description:
    //     'Kegiatan donor darah untuk membantu ketersediaan stok darah di PMI. Kami mengajak masyarakat umum untuk berpartisipasi demi membantu sesama yang membutuhkan.',
    //   requirement:
    //     '1. Berusia 17-60 tahun\n2. Berat badan minimal 45kg\n3. Tekanan darah normal\n4. Tidak sedang sakit atau minum obat-obatan tertentu\n5. Minimal 3 bulan sejak donor darah terakhir',
    //   contactPerson: '081122334455',
    //   maxApplicant: 100,
    //   acceptedQuota: 100,
    //   startAt: new Date(2025, 5, 10, 10, 0), // 10 Juni 2025, 10:00
    //   endAt: new Date(2025, 5, 10, 16, 0), // 10 Juni 2025, 16:00
    //   isPaid: false,
    //   price: 0,
    //   province: 'Jawa Barat',
    //   regency: 'Kota Bandung',
    //   address: 'Aula Graha Pena, Jl. Merdeka No. 45, Bandung',
    //   gmaps: 'https://maps.google.com/?q=-6.9175,107.6191',
    //   latitude: -6.9175,
    //   longitude: 107.6191,
    //   bannerImageId: 'blood_donation_banner',
    //   bannerUrl:
    //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVBD6MqMu5xNNMIq5qb-HAgPQc1e34UGEmQ&s', // Ganti dengan URL gambar yang sebenarnya
    //   isRelease: true,
    //   categoryNames: ['Sosial', 'Kesehatan'],
    //   userIndex: 2,
    // },
  ];

  // Buat event di database
  for (const eventTemplate of eventTemplates) {
    // Pastikan user ada
    if (users[eventTemplate.userIndex]) {
      const userId = users[eventTemplate.userIndex].id;

      // Konversi nama kategori ke ID kategori
      const categoryIds = [];
      for (const categoryName of eventTemplate.categoryNames) {
        const categoryId = getCategoryIdByName(categoryName);
        if (categoryId) {
          categoryIds.push(categoryId);
        }
      }

      // Dapatkan benefit milik user ini
      const userBenefits = getBenefitsByUserId(userId);

      // Ambil maksimal 3 benefit jika ada
      const benefitIds = userBenefits.slice(
        0,
        Math.min(userBenefits.length, 3),
      );

      // Buat data event
      const eventData = {
        userId,
        title: eventTemplate.title,
        slug: generateSlug(eventTemplate.title),
        type: eventTemplate.type,
        description: eventTemplate.description,
        requirement: eventTemplate.requirement,
        contactPerson: eventTemplate.contactPerson,
        maxApplicant: eventTemplate.maxApplicant,
        acceptedQuota: eventTemplate.acceptedQuota,
        startAt: eventTemplate.startAt,
        endAt: eventTemplate.endAt,
        isPaid: eventTemplate.isPaid,
        price: eventTemplate.price,
        province: eventTemplate.province,
        regency: eventTemplate.regency,
        address: eventTemplate.address,
        gmaps: eventTemplate.gmaps,
        latitude: eventTemplate.latitude,
        longitude: eventTemplate.longitude,
        bannerImageId: eventTemplate.bannerImageId,
        bannerUrl: eventTemplate.bannerUrl,
        isRelease: eventTemplate.isRelease,
        createdAt: new Date(),
        categoryIds,
        benefitIds,
      };

      // Buat event
      await createEvent(eventData);
      console.log(
        `Event "${eventTemplate.title}" untuk user ID ${userId} berhasil dibuat`,
      );
    }
  }
};

export default async () => {
  try {
    await seedEvents();
    console.log('Data event berhasil di-seed.');
  } catch (error) {
    console.error('Error saat seeding event:', error);
  }
};
