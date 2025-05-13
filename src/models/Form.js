import prisma from '../configs/dbConfig.js';

export const createForm = async (data) => {
  return await prisma.form.create({ data });
};

export const createForms = async (data) => {
  return await prisma.form.createMany({ data });
}

export const getAllForms = async () => {
  return prisma.form.findMany({
    include: {
      event: true,
    },
  });
};

export const getFormById = async (id) => {
  return prisma.form.findUnique({
    where: { id },
    include: {
      event: true,
    },
  });
};

export const getFormsByEventId = async (eventId) => {
  return prisma.form.findFirst({
    where: { eventId },
    include: {
      event: true,
    },
  });
};

export const getFormsByPartnerId = async (partnerId) => {
  return prisma.form.findMany({
    where: {
      event: {
        userId: partnerId,
      },
    },
    include: {
      event: true,
    },
  });
};

export const updateForm = async (id, data) => {
  return prisma.form.update({
    where: { id },
    data,
    include: {
      event: true,
    },
  });
};

export const deleteForm = async (id) => {
  return prisma.form.delete({
    where: { id },
  });
};