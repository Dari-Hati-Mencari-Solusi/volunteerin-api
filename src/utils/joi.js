/**
 * Fungsi untuk menghasilkan pesan error dari validasi Joi dengan dukungan pesan custom.
 *
 * @param {Joi.ValidationError} error - Error yang dihasilkan oleh validasi Joi.
 * @param {Object} customErrors - Objek yang berisi pesan custom untuk field tertentu.
 *                                Format: { field: "pesan custom" }.
 *                                Contoh: { phoneNumber: "Nomor telepon harus dimulai dengan 62." }.
 * @returns {Array<string>} - Array yang berisi pesan-pesan error. Jika ada pesan custom,
 *                            pesan custom akan digunakan. Jika tidak, pesan default dari Joi akan digunakan.
 */
export const generateJoiError = (error, customErrors = {}) => {
  const message = error.details.map((err) => {
    const key = err.context.key;

    if (customErrors[key]) return customErrors[key];

    return err.message;
  });

  return message;
};
