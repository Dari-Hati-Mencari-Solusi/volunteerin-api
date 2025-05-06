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
    where: {
      role: 'PARTNER', // Only get users with PARTNER role
    },
    take: 5, // Ambil 3 user pertama
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
    {
      title: 'Workshop Coding untuk Anak Panti Asuhan',
      type: 'LIMITED',
      description:
        'Workshop coding dasar untuk memperkenalkan anak-anak panti asuhan pada dunia pemrograman. Peserta akan belajar dasar-dasar HTML, CSS, dan JavaScript melalui aktivitas interaktif dan menyenangkan.',
      requirement:
        '1. Anak panti asuhan usia 12-18 tahun\n2. Tidak perlu pengalaman coding sebelumnya\n3. Laptop akan disediakan\n4. Wajib mengikuti seluruh sesi workshop',
      contactPerson: '087654321098',
      maxApplicant: 20,
      acceptedQuota: 20,
      startAt: new Date(2025, 5, 1, 9, 0), // 1 Juni 2025, 09:00
      endAt: new Date(2025, 5, 2, 15, 0), // 2 Juni 2025, 15:00
      isPaid: false,
      price: 0,
      province: 'DKI Jakarta',
      regency: 'Jakarta Selatan',
      address: 'Panti Asuhan Kasih, Jl. Kemang Raya No. 10, Jakarta Selatan',
      gmaps: 'https://maps.google.com/?q=-6.2601,106.8113',
      latitude: -6.2601,
      longitude: 106.8113,
      bannerImageId: 'coding_workshop_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGkiwx-o0nVsiErGpBg5-dBp_GIkqyLvK1cw&s', // Ganti dengan URL gambar yang sebenarnya
      isRelease: true,
      categoryNames: ['Pendidikan', 'Teknologi'],
      userIndex: 1,
    },
    {
      title: 'Donor Darah Massal',
      type: 'OPEN',
      description:
        'Kegiatan donor darah untuk membantu ketersediaan stok darah di PMI. Kami mengajak masyarakat umum untuk berpartisipasi demi membantu sesama yang membutuhkan.',
      requirement:
        '1. Berusia 17-60 tahun\n2. Berat badan minimal 45kg\n3. Tekanan darah normal\n4. Tidak sedang sakit atau minum obat-obatan tertentu\n5. Minimal 3 bulan sejak donor darah terakhir',
      contactPerson: '081122334455',
      maxApplicant: 100,
      acceptedQuota: 100,
      startAt: new Date(2025, 5, 10, 10, 0), // 10 Juni 2025, 10:00
      endAt: new Date(2025, 5, 10, 16, 0), // 10 Juni 2025, 16:00
      isPaid: false,
      price: 0,
      province: 'Jawa Barat',
      regency: 'Kota Bandung',
      address: 'Aula Graha Pena, Jl. Merdeka No. 45, Bandung',
      gmaps: 'https://maps.google.com/?q=-6.9175,107.6191',
      latitude: -6.9175,
      longitude: 107.6191,
      bannerImageId: 'blood_donation_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVBD6MqMu5xNNMIq5qb-HAgPQc1e34UGEmQ&s', // Ganti dengan URL gambar yang sebenarnya
      isRelease: true,
      categoryNames: ['Sosial', 'Kesehatan'],
      userIndex: 2,
    },
    {
      title: 'Pengajaran Bahasa Inggris untuk Anak Kurang Mampu',
      type: 'LIMITED',
      description:
        'Program pengajaran bahasa Inggris untuk membantu anak-anak dari keluarga kurang mampu meningkatkan kemampuan berbahasa Inggris mereka. Program ini bertujuan memberikan kesempatan pendidikan yang lebih baik.',
      requirement:
        '1. Mahasiswa atau sarjana dengan kemampuan bahasa Inggris baik\n2. Komitmen mengajar selama minimal 3 bulan\n3. Bersedia mengikuti pelatihan pengajaran\n4. Membawa laptop untuk persiapan materi',
      contactPerson: '081234512345',
      maxApplicant: 15,
      acceptedQuota: 10,
      startAt: new Date(2025, 6, 1, 14, 0), // 1 Juli 2025, 14:00
      endAt: new Date(2025, 8, 30, 16, 0), // 30 September 2025, 16:00
      isPaid: false,
      price: 0,
      province: 'Jawa Timur',
      regency: 'Kota Surabaya',
      address: 'Yayasan Cerdas Mandiri, Jl. Nginden 21, Surabaya',
      gmaps: 'https://maps.google.com/?q=-7.2981,112.7685',
      latitude: -7.2981,
      longitude: 112.7685,
      bannerImageId: 'english_teaching_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyPNVdgjWiI7FRS5JjGP7kPDfXnCFc6I9-Dw&s',
      isRelease: true,
      categoryNames: ['Pendidikan', 'Sosial'],
      userIndex: 0,
    },
    {
      title: 'Penanaman Mangrove di Pesisir Semarang',
      type: 'OPEN',
      description:
        'Kegiatan penanaman mangrove untuk memperbaiki ekosistem pesisir dan mencegah abrasi pantai. Relawan akan diajarkan teknik penanaman yang benar dan pentingnya hutan mangrove bagi lingkungan pantai.',
      requirement:
        '1. Berusia minimal 16 tahun\n2. Membawa pakaian ganti\n3. Bersedia bekerja di area berlumpur\n4. Mengikuti arahan tim konservasi',
      contactPerson: '085667778889',
      maxApplicant: 75,
      acceptedQuota: 75,
      startAt: new Date(2025, 7, 5, 7, 0), // 5 Agustus 2025, 07:00
      endAt: new Date(2025, 7, 5, 13, 0), // 5 Agustus 2025, 13:00
      isPaid: false,
      price: 0,
      province: 'Jawa Tengah',
      regency: 'Kota Semarang',
      address: 'Hutan Mangrove Tapak, Tugurejo, Semarang',
      gmaps: 'https://maps.google.com/?q=-6.9528,110.3267',
      latitude: -6.9528,
      longitude: 110.3267,
      bannerImageId: 'mangrove_planting_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXcC3xsRXl8H4m36RK_OrZdZhZPzxkwR7kLA&s',
      isRelease: true,
      categoryNames: ['Lingkungan', 'Konservasi'],
      userIndex: 1,
    },
    {
      title: 'Pelatihan Digital Marketing untuk UMKM',
      type: 'LIMITED',
      description:
        'Program pelatihan digital marketing untuk membantu pelaku UMKM memasarkan produk mereka secara online. Peserta akan belajar tentang social media marketing, content creation, dan dasar-dasar SEO.',
      requirement:
        '1. Pemilik atau pengelola UMKM aktif\n2. Memiliki smartphone dan laptop\n3. Kemampuan dasar mengoperasikan komputer\n4. Bersedia menyiapkan produk untuk praktik marketing',
      contactPerson: '082233445566',
      maxApplicant: 30,
      acceptedQuota: 30,
      startAt: new Date(2025, 5, 20, 9, 0), // 20 Juni 2025, 09:00
      endAt: new Date(2025, 5, 21, 16, 0), // 21 Juni 2025, 16:00
      isPaid: true,
      price: 150000,
      province: 'DI Yogyakarta',
      regency: 'Kota Yogyakarta',
      address:
        'Co-working Space Jogja Digital Valley, Jl. Magelang KM 6, Yogyakarta',
      gmaps: 'https://maps.google.com/?q=-7.7833,110.3667',
      latitude: -7.7833,
      longitude: 110.3667,
      bannerImageId: 'digital_marketing_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo-c8MUBfU5GLPVXXwlp1-cB1B7D_NnQB_bQ&s',
      isRelease: true,
      categoryNames: ['Teknologi', 'Ekonomi'],
      userIndex: 2,
    },
    {
      title: 'Pengolahan Sampah Plastik Menjadi Kerajinan',
      type: 'OPEN',
      description:
        'Workshop mengolah sampah plastik menjadi berbagai produk kerajinan bernilai jual. Peserta akan diajarkan teknik upcycling yang dapat diterapkan dalam kehidupan sehari-hari atau dikembangkan menjadi usaha.',
      requirement:
        '1. Terbuka untuk umum segala usia (anak di bawah 12 tahun didampingi orang tua)\n2. Membawa gunting dan lem tembak jika memiliki\n3. Membawa sampah plastik bersih dari rumah',
      contactPerson: '089977665544',
      maxApplicant: 40,
      acceptedQuota: 40,
      startAt: new Date(2025, 6, 15, 13, 0), // 15 Juli 2025, 13:00
      endAt: new Date(2025, 6, 15, 17, 0), // 15 Juli 2025, 17:00
      isPaid: false,
      price: 0,
      province: 'Jawa Barat',
      regency: 'Kota Bogor',
      address: 'Balai RW 05, Kelurahan Bantarjati, Bogor',
      gmaps: 'https://maps.google.com/?q=-6.5971,106.8060',
      latitude: -6.5971,
      longitude: 106.806,
      bannerImageId: 'plastic_craft_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJkRFdMH_eQXXnDZ9KL0ZtZhxglKQHOJdY_A&s',
      isRelease: true,
      categoryNames: ['Lingkungan', 'Seni'],
      userIndex: 0,
    },
    {
      title: 'Pemeriksaan Kesehatan Gratis',
      type: 'OPEN',
      description:
        'Kegiatan pemeriksaan kesehatan gratis untuk masyarakat prasejahtera. Layanan meliputi pemeriksaan tekanan darah, gula darah, kolesterol, dan konsultasi kesehatan umum.',
      requirement:
        '1. Tenaga medis bersertifikat (dokter, perawat, bidan)\n2. Mahasiswa kedokteran tingkat akhir\n3. Bersedia bertugas selama 6 jam\n4. Membawa perlengkapan medis pribadi',
      contactPerson: '081356789000',
      maxApplicant: 25,
      acceptedQuota: 25,
      startAt: new Date(2025, 8, 8, 8, 0), // 8 September 2025, 08:00
      endAt: new Date(2025, 8, 8, 14, 0), // 8 September 2025, 14:00
      isPaid: false,
      price: 0,
      province: 'Sumatera Utara',
      regency: 'Kota Medan',
      address: 'Balai Kelurahan Medan Johor, Jl. Karya Jaya 12, Medan',
      gmaps: 'https://maps.google.com/?q=3.5896,98.6731',
      latitude: 3.5896,
      longitude: 98.6731,
      bannerImageId: 'health_check_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-znRh8yEt7ggaQTztD8hNNOBdJgnUn3b2w&s',
      isRelease: true,
      categoryNames: ['Kesehatan', 'Sosial'],
      userIndex: 1,
    },
    {
      title: 'Pengenalan Robotika untuk Sekolah Dasar',
      type: 'LIMITED',
      description:
        'Program memperkenalkan dasar-dasar robotika dan coding untuk anak sekolah dasar. Menggunakan kit robotika sederhana, anak-anak akan belajar logika pemrograman melalui permainan interaktif.',
      requirement:
        '1. Mahasiswa jurusan teknik, komputer, atau pendidikan\n2. Memiliki pengalaman dengan robotika dasar\n3. Sabar dan senang bekerja dengan anak-anak\n4. Komitmen untuk 4 pertemuan',
      contactPerson: '082145678901',
      maxApplicant: 10,
      acceptedQuota: 8,
      startAt: new Date(2025, 7, 12, 10, 0), // 12 Agustus 2025, 10:00
      endAt: new Date(2025, 8, 2, 12, 0), // 2 September 2025, 12:00
      isPaid: true,
      price: 200000,
      province: 'DKI Jakarta',
      regency: 'Jakarta Timur',
      address: 'SD Negeri 5 Rawamangun, Jl. Pemuda 45, Jakarta Timur',
      gmaps: 'https://maps.google.com/?q=-6.1934,106.8823',
      latitude: -6.1934,
      longitude: 106.8823,
      bannerImageId: 'robotics_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrQPOFyDlMCNZ9JBd7LmUWa9XevVHiOg_fBg&s',
      isRelease: true,
      categoryNames: ['Pendidikan', 'Teknologi'],
      userIndex: 2,
    },
    {
      title: 'Pelatihan Pertolongan Pertama',
      type: 'LIMITED',
      description:
        'Pelatihan pertolongan pertama dasar (P3K) untuk karyawan perusahaan dan masyarakat umum. Peserta akan belajar teknik P3K, penanganan darurat, CPR, dan penggunaan AED.',
      requirement:
        '1. Berusia minimal 18 tahun\n2. Kondisi fisik sehat\n3. Bersedia mengikuti praktik langsung\n4. Membawa pakaian nyaman untuk praktik',
      contactPerson: '085678901234',
      maxApplicant: 30,
      acceptedQuota: 30,
      startAt: new Date(2025, 5, 25, 9, 0), // 25 Juni 2025, 09:00
      endAt: new Date(2025, 5, 26, 15, 0), // 26 Juni 2025, 15:00
      isPaid: true,
      price: 350000,
      province: 'Jawa Timur',
      regency: 'Kota Malang',
      address: 'Aula PMI Kota Malang, Jl. Buring 10, Malang',
      gmaps: 'https://maps.google.com/?q=-7.9797,112.6304',
      latitude: -7.9797,
      longitude: 112.6304,
      bannerImageId: 'first_aid_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9RqNdBMAGfNOGW4m7-dF1TIwgrlI_cmmAKQ&s',
      isRelease: true,
      categoryNames: ['Kesehatan', 'Pendidikan'],
      userIndex: 0,
    },
    {
      title: 'Pendampingan Lansia di Panti Jompo',
      type: 'OPEN',
      description:
        'Program pendampingan lansia di panti jompo dengan aktivitas seperti membaca buku, bermain games sederhana, mendengarkan cerita, atau sekadar menemani berbincang-bincang.',
      requirement:
        '1. Berusia minimal 17 tahun\n2. Sabar dan suka berinteraksi dengan lansia\n3. Komitmen minimal 1 kali kunjungan per minggu\n4. Dapat membaca dengan jelas',
      contactPerson: '081234567800',
      maxApplicant: 20,
      acceptedQuota: 20,
      startAt: new Date(2025, 6, 5, 14, 0), // 5 Juli 2025, 14:00
      endAt: new Date(2025, 9, 5, 16, 0), // 5 Oktober 2025, 16:00
      isPaid: false,
      price: 0,
      province: 'Jawa Tengah',
      regency: 'Kota Solo',
      address: 'Panti Werdha Dharma Bhakti, Jl. Slamet Riyadi 201, Solo',
      gmaps: 'https://maps.google.com/?q=-7.5594,110.8318',
      latitude: -7.5594,
      longitude: 110.8318,
      bannerImageId: 'elderly_support_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHzLNfZ_s1C6w9Zy2UWVW8CyTJGUeNOc9OYQ&s',
      isRelease: true,
      categoryNames: ['Sosial', 'Kesehatan'],
      userIndex: 1,
    },
    {
      title: 'Festival Seni Budaya Tradisional',
      type: 'OPEN',
      description:
        'Membantu penyelenggaraan festival seni budaya tradisional yang menampilkan berbagai kesenian daerah. Relawan akan membantu koordinasi acara, dekorasi, pengarahan pengunjung, dan dokumentasi.',
      requirement:
        '1. Memiliki minat terhadap seni dan budaya tradisional\n2. Mampu bekerja dalam tim\n3. Berkomitmen selama persiapan dan pelaksanaan festival\n4. Memiliki keterampilan fotografi (nilai plus)',
      contactPerson: '087890123456',
      maxApplicant: 50,
      acceptedQuota: 45,
      startAt: new Date(2025, 9, 18, 8, 0), // 18 Oktober 2025, 08:00
      endAt: new Date(2025, 9, 20, 22, 0), // 20 Oktober 2025, 22:00
      isPaid: false,
      price: 0,
      province: 'Bali',
      regency: 'Kabupaten Gianyar',
      address: 'Lapangan Desa Ubud, Gianyar, Bali',
      gmaps: 'https://maps.google.com/?q=-8.5069,115.2625',
      latitude: -8.5069,
      longitude: 115.2625,
      bannerImageId: 'cultural_festival_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWB-qaK_wXgJUPd9Qc8sLFBNgkF4ReCyLVIQ&s',
      isRelease: true,
      categoryNames: ['Seni', 'Budaya'],
      userIndex: 2,
    },
    {
      title: 'Pengembangan Aplikasi untuk Disabilitas',
      type: 'LIMITED',
      description:
        'Proyek pengembangan aplikasi mobile untuk membantu penyandang disabilitas dalam aktivitas sehari-hari. Relawan akan bekerja dalam tim untuk merancang, mengembangkan, dan menguji aplikasi.',
      requirement:
        '1. Memiliki kemampuan programming (Java/Kotlin untuk Android, Swift untuk iOS)\n2. Pengalaman UI/UX design\n3. Pemahaman tentang aksesibilitas digital\n4. Komitmen untuk proyek 2 bulan',
      contactPerson: '082345678901',
      maxApplicant: 12,
      acceptedQuota: 10,
      startAt: new Date(2025, 7, 1, 19, 0), // 1 Agustus 2025, 19:00
      endAt: new Date(2025, 8, 30, 21, 0), // 30 September 2025, 21:00
      isPaid: true,
      price: 500000,
      province: 'DKI Jakarta',
      regency: 'Jakarta Selatan',
      address: 'Co-working Space The Hive, Jl. Kemang Raya 45, Jakarta Selatan',
      gmaps: 'https://maps.google.com/?q=-6.2606,106.8163',
      latitude: -6.2606,
      longitude: 106.8163,
      bannerImageId: 'disability_app_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbYP-haQYMc4KBET9tP61vj56L6IpvKv7Xcg&s',
      isRelease: true,
      categoryNames: ['Teknologi', 'Sosial'],
      userIndex: 0,
    },
    {
      title: 'Kampanye Kesadaran Kesehatan Mental di Kampus',
      type: 'OPEN',
      description:
        'Program kampanye untuk meningkatkan kesadaran tentang kesehatan mental di lingkungan kampus. Kegiatan meliputi seminar, diskusi kelompok, dan penyebaran materi edukatif.',
      requirement:
        '1. Mahasiswa aktif dari berbagai jurusan\n2. Memiliki pemahaman dasar tentang kesehatan mental\n3. Kemampuan komunikasi yang baik\n4. Pernah mengikuti organisasi kampus',
      contactPerson: '089012345678',
      maxApplicant: 25,
      acceptedQuota: 20,
      startAt: new Date(2025, 8, 10, 13, 0), // 10 September 2025, 13:00
      endAt: new Date(2025, 8, 24, 17, 0), // 24 September 2025, 17:00
      isPaid: false,
      price: 0,
      province: 'Jawa Barat',
      regency: 'Kota Depok',
      address: 'Kampus Universitas Indonesia, Depok',
      gmaps: 'https://maps.google.com/?q=-6.3656,106.8223',
      latitude: -6.3656,
      longitude: 106.8223,
      bannerImageId: 'mental_health_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_WBBB9XllVUvG9cDPXEchnW8gYIJ6YgufnA&s',
      isRelease: true,
      categoryNames: ['Kesehatan', 'Pendidikan'],
      userIndex: 1,
    },
    {
      title: 'Pelatihan Keterampilan Hidup Sehat untuk Remaja',
      type: 'LIMITED',
      description:
        'Pelatihan keterampilan hidup sehat untuk remaja, termasuk pola makan sehat, olahraga teratur, dan manajemen stres. Peserta akan mendapatkan pengetahuan dan keterampilan untuk hidup lebih sehat.',
      requirement:
        '1. Remaja usia 13-18 tahun\n2. Komitmen untuk mengikuti seluruh sesi pelatihan\n3. Membawa alat tulis dan buku catatan\n4. Bersedia berpartisipasi aktif dalam diskusi',
      contactPerson: '081234567890',
      maxApplicant: 30,
      acceptedQuota: 25,
      startAt: new Date(2025, 9, 1, 10, 0), // 1 Oktober 2025, 10:00
      endAt: new Date(2025, 9, 3, 15, 0), // 3 Oktober 2025, 15:00
      isPaid: false,
      price: 0,
      province: 'Bali',
      regency: 'Kota Denpasar',
      address: 'Balai Pemuda Denpasar, Jl. Hayam Wuruk No. 10, Denpasar',
      gmaps: 'https://maps.google.com/?q=-8.6500,115.2167',
      latitude: -8.65,
      longitude: 115.2167,
      bannerImageId: 'healthy_living_banner',
      bannerUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6xXkzZcJmYg4vGxWjXy2a6bqkVtLh4n7r8A&s',
      isRelease: true,
      categoryNames: ['Kesehatan', 'Pendidikan'],
      userIndex: 2,
    },
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
