import prisma from "../configs/dbConfig.js";

export const createResponsiblePerson = async (data) => {
  return prisma.responsiblePerson.create({ data });
}