import { createCategories } from "../models/Category.js"

const categories = [
  {
    name: "Sosial",
    description: "Kegiatan untuk membantu masyarakat yang membutuhkan, seperti bantuan bencana, bakti sosial, dan donor darah.",
    createdAt: new Date()
  },
  {
    name: "Pendidikan",
    description: "Event yang berfokus pada peningkatan pendidikan, seperti mengajar anak kurang mampu, mentoring, dan kelas literasi digital.",
    createdAt: new Date()
  },
  {
    name: "Lingkungan",
    description: "Kegiatan untuk menjaga dan memperbaiki lingkungan, seperti penghijauan, pembersihan sampah, dan konservasi satwa liar.",
    createdAt: new Date()
  },
  {
    name: "Kesehatan",
    description: "Program yang mendukung kesehatan fisik dan mental masyarakat, seperti penyuluhan kesehatan, kampanye hidup sehat, dan pendampingan pasien.",
    createdAt: new Date()
  },
  {
    name: "Budaya",
    description: "Kegiatan yang melestarikan budaya dan seni, seperti festival budaya, pementasan seni, dan workshop kerajinan tangan.",
    createdAt: new Date()
  },
  {
    name: "Teknologi",
    description: "Event berbasis teknologi, seperti hackathon sosial, workshop coding, dan pengembangan open-source untuk komunitas.",
    createdAt: new Date()
  },
  {
    name: "Keagamaan",
    description: "Kegiatan keagamaan yang mempererat nilai spiritual dan sosial, seperti buka puasa bersama, amal keagamaan, dan renovasi tempat ibadah.",
    createdAt: new Date()
  },
  {
    name: "Ekonomi",
    description: "Program yang membantu UMKM dan komunitas, seperti pelatihan kewirausahaan, pendampingan usaha kecil, dan bazaar amal.",
    createdAt: new Date()
  },
  {
    name: "Hak Asasi",
    description: "Kegiatan yang mendukung hak asasi manusia, seperti advokasi disabilitas, kampanye anti-kekerasan, dan edukasi kesetaraan gender.",
    createdAt: new Date()
  }
];

export default async () => {
  await createCategories(categories);
  console.log('Category data successfully seeded.');
};