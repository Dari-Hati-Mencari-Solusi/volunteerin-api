import prisma from '../configs/dbConfig.js';

// return multiple object
export const getFormResponsesByUserId = async (userId) => {
  return prisma.formResponse.findMany({ where: { userId } });
}

// return single object
export const getFormResponseByFormId = async (formId) => {
  return prisma.formResponse.findUnique({ where: { formId } });
}

export const getFormResponseByFormIdAndUserId = async (formId, userId) => {
  return prisma.formResponse.findFirst({ where: { formId, userId } });
}

export const createFormResponse = async (data) => {
  return prisma.formResponse.create({ data });
}