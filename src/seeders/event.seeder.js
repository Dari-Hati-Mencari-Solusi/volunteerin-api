// import moment from "moment";
// import { createEvents } from "../models/Event.js";
// import { getUsers } from "../models/User.js";
// import { faker, fakerID } from "./seederConfig.js";
// import { getCategories } from "../models/Category.js";

// const eventTitles = [
//   "Aksi Peduli Sesama: Relawan untuk Kebaikan",
//   "Bakti Sosial Harapan Baru",
//   "Donor Darah Bersama: Setetes Darah, Sejuta Harapan",
//   "Relawan Bencana: Bersama Pulihkan Negeri",
//   "Berbagi Senyum di Panti Asuhan",
//   "Gerakan Literasi: Ayo Mengajar Anak Bangsa!",
//   "Mentor Muda: Bantu Adik-Adik Raih Masa Depan",
//   "Kelas Inspirasi: Jadi Relawan Pengajar Sehari",
//   "Coding for Kids: Mengenalkan Teknologi Sejak Dini",
//   "Bantu Sekolah Pelosok: Misi 1000 Buku!",
//   "Green Earth Movement: Bersama Hijaukan Bumi!",
//   "Beach Cleanup Day: Bersihkan Pantai, Selamatkan Laut",
//   "Aksi Tanam Pohon: Satu Pohon, Sejuta Manfaat",
//   "Plastic-Free Challenge: Kurangi Sampah, Selamatkan Bumi",
//   "Relawan Konservasi: Jaga Hutan, Lestarikan Alam!",
//   "Sehat Bersama: Kampanye Hidup Sehat untuk Semua",
//   "Peduli Mental: Jadi Relawan Pendampingan Psikologi",
//   "Ceria Bersama: Relawan untuk Anak-Anak Penyintas Penyakit",
//   "Senam Sehat Lansia: Relawan untuk Kebugaran Bersama",
//   "Gerakan Sehat: Edukasi Gizi untuk Masyarakat",
//   "Festival Budaya: Jadi Relawan di Pesta Seni Nusantara!",
//   "Lestarikan Warisan: Relawan Pelestari Budaya Lokal",
//   "Seni untuk Semua: Workshop Gratis bagi Anak Muda",
//   "Pentas Amal: Relawan di Balik Panggung",
//   "Ekspresi Kreatif: Bantu Wujudkan Mimpi Seniman Muda",
//   "Tech for Good: Hackathon untuk Solusi Sosial!",
//   "Relawan Digital: Bantu UMKM Melek Teknologi",
//   "Website for Change: Bantu NGO Punya Website Gratis!",
//   "Workshop Coding Gratis: Jadi Pengajar Digital untuk Pemula",
//   "Aksi AI: Gunakan Teknologi untuk Kemanusiaan",
//   "Ramadan Berbagi: Relawan Buka Puasa Bersama Yatim",
//   "Relawan Kurban: Tebar Kebahagiaan Idul Adha",
//   "Bakti Ibadah: Renovasi Tempat Ibadah Bersama",
//   "Sahabat Rohani: Program Pendampingan Religi",
//   "Aksi Natal Ceria: Relawan Berbagi Kado Kasih",
//   "Bantu UMKM Bangkit: Relawan Pemberdayaan Ekonomi",
//   "Kelas Bisnis Sosial: Relawan untuk Pelatihan Wirausaha",
//   "Bazaar Amal: Relawan untuk Event Charity Ekonomi",
//   "Inkubator Startup Sosial: Dukung Pengusaha Muda!",
//   "Keuangan Cerdas: Edukasi Finansial untuk Anak Muda",
//   "Suara untuk Semua: Relawan Advokasi Hak Asasi",
//   "Bersama Setara: Kampanye Kesetaraan Gender",
//   "Dukung Disabilitas: Jadi Relawan untuk Inklusi Sosial",
//   "Stop Kekerasan: Relawan Penyuluhan Perlindungan Anak",
//   "Perjuangan untuk Kemanusiaan: Relawan Aksi Sosial",
// ];

// const generatePrice = (minPrice, maxPrice) => {
//   const minRibu = Math.ceil(minPrice / 1000);
//   const maxRibu = Math.floor(maxPrice / 1000);

//   const randomRibu = Math.floor(Math.random() * (maxRibu - minRibu + 1)) + minRibu;

//   return (randomRibu * 1000).toLocaleString('id-ID');
// }

// const generateRandomBoolean = () => {
//   return Math.random() >= 0.5;
// }

// export default async () => {
//   const eventTypes = ['OPEN', 'LIMITED'];
//   const users = await getUsers();
//   const categories = await getCategories();

//   const events = Array.from({ length: eventTitles.length }).map((_, index) => {
//     const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
//     const maxApplicant = type === 'LIMITED' ? Math.floor(Math.random() * 71) + 30 : 0; // random angka 30 - 100

//     const randomAcceptedQuota = [0, 15, 30, 50, 75]
//     const acceptedQuota = randomAcceptedQuota[Math.floor(Math.random() * randomAcceptedQuota.length)]

//     const startAt = moment().toISOString();
//     const endAt = moment().add(Math.floor(Math.random() * 14) + 7, 'days').toISOString();

//     const isPaid = generateRandomBoolean();
//     const price = isPaid ? generatePrice(20000, 100000) : 0;

//     const provinces = ['Jawa Tengah', 'Yogyakarta', 'Jawa Barat'];
//     const province = provinces[Math.floor(Math.random() * provinces.length)]

//     return {
//       userId: users[1].id,
//       title: eventTitles[index],
//       slug: eventTitles[index].toLowerCase().replace(/\s+/g, '-'),
//       type,
//       description: faker.lorem.paragraphs(4, '<br/><br/>\n'),
//       requirement: faker.lorem.sentences(8, '<br/>\n'),
//       contactPerson: '62123456897',
//       maxApplicant,
//       acceptedQuota,
//       startAt,
//       endAt,
//       isPaid,
//       price,
//       province,
//       regency: 'Sleman',
//       address: faker.lorem.words(6),
//       gmaps: 'https://maps.app.goo.gl/bF4C83di13XXAn436',
//       bannerUrl: 'https://ik.imagekit.io/rm7q1v1y0/banner.jpg?updatedAt=1743173533081',
//       isRelease: true,
//       createdAt: new Date()
//     }
//   });

//   await createEvents(events);
//   console.log('Events successfully seeded')
// }
