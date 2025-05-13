import prisma from "../configs/dbConfig.js";

export const createResponsiblePerson = async (data) => {
  return prisma.responsiblePerson.create({ data });
}

export const getResponsiblePersonByPartnerProfileId = async (partnerProfileId) => {
  return prisma.responsiblePerson.findUnique({ where: { partnerProfileId } });
}

export const updateResponsiblePersonByPartnerProfileId = async (partnerProfileId, data) => {
  return prisma.responsiblePerson.update({
    where: { partnerProfileId },
    data
  });
}