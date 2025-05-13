import prisma from '../configs/dbConfig.js';

export const createLegality = async (data) => {
  return prisma.legality.create({ data });
}

export const getLegalityByPartnerProfileId = async (partnerProfileId) => {
  return prisma.legality.findUnique({ where: { partnerProfileId } });
}