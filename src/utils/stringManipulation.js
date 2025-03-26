/**
 * Memisahkan nilai variabel kombinasi angka dan huruf.
 * Contoh: 200KB menjadi [200, 'KB'] atau 1.5MB menjadi [1.5, 'MB']
 * Note: Hanya berlaku untuk depannya angka dan belakangnya huruf
 *
 * @param {string} size Isi dengan 200KB atau 1MB. Jangan aneh aneh
 * @returns
 */
export const splitSize = (size) => {
  const match = String(size).match(/(\d+)([a-zA-Z]+)/);
  return match ? [parseInt(match[1]), match[2]] : [];
};
