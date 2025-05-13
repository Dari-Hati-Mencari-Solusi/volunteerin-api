import prisma from '../configs/dbConfig.js';

export const createParticipant = async (data) => {
  return prisma.participant.create({ data });
}