
/**
 * 
 * @param {Object} withParam -  key kunci untuk filtering - ex: { legality: true }
 * @param {Array<String>} allowedRelations - list relasi yang diperbolehkan - ex: ['legality', 'organization']
 * @returns {}
 */
export const filterAllowedRelation = (withParam, allowedRelations) => {
  return Object.fromEntries(
    Object.entries(withParam).filter(([key]) => allowedRelations.includes(key))
  );
}