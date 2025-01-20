export function generateJoiError(error) {
  const message = error.details.map((err) => err.message);
  return message;
}
