import prisma from '../configs/dbConfig.js';

// return multiple object
export const getFormResponsesByUserId = async (userId) => {
  return prisma.formResponse.findMany({ where: { userId } });
};

// return single object
export const getFormResponseByFormId = async (formId) => {
  return prisma.formResponse.findUnique({ where: { formId } });
};

export const getFormResponseById = async (id) => {
  return prisma.formResponse.findUnique({ where: { id } });
};

export const getFormResponseByFormIdAndUserId = async (formId, userId) => {
  return prisma.formResponse.findFirst({ where: { formId, userId } });
};

export const createFormResponse = async (data) => {
  return prisma.formResponse.create({ data });
};

export const createFormResponses = async (data) => {
  return prisma.formResponse.createMany({ data });
};

export const getRegistrants = async (
  formId,
  { s: search, status, page, limit, sort },
) => {
  const role = 'VOLUNTEER';
  status = status?.toUpperCase(status);

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  sort = sort || 'desc';
  const skip = (page - 1) * limit;

  const where = {
    formId,
    ...(status?.trim() && { status }),
    user: {
      AND: [
        { role },
        ...(search?.trim()
          ? [
              {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                ],
              },
            ]
          : []),
      ],
    },
  };

  const [registrants, totalItems] = await Promise.all([
    prisma.formResponse.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: sort },
      include: {
        user: true,
      },
    }),
    prisma.formResponse.count({
      where,
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems,
    data: registrants,
  };
};

export const getRegistrantById = async (registrantId) => {
  const formResponseId = registrantId;

  const includeHistoryJoinedEvent = {
    include: {
      event: {
        select: {
          title: true,
        },
      },
    },
  };
  const includeWith = {
    user: {
      include: {
        profile: true,
        participations: includeHistoryJoinedEvent
      }
    }
  }

  return prisma.formResponse.findUnique({
    where: { id: formResponseId },
    include: includeWith
  });
};

export const updateRegistrantById = async (id, data) => {
  return prisma.formResponse.update({
    where: { id },
    data,
  });
}