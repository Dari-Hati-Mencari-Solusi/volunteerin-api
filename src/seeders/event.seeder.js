import { PrismaClient } from '@prisma/client';
import { fakerID_ID as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const events = Array.from({ length: 10 }).map(() => ({
  userId: 1,
  title: faker.commerce.productName(),
  startAt: faker.date.future(),
  endAt: faker.date.future(),
  bannerUrl: faker.image.url(),
  description: faker.lorem.paragraph(),
  termsAndConditions: faker.lorem.paragraph(),
  isRelease: faker.datatype.boolean(),
  contactPerson: faker.phone.number('628##########'),
  location: faker.location.city(),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
}));

const seedEvents = async () => {
  for (const event of events) {
    await prisma.event.create({
      data: {
        ...event,
        categories: {
          connect: [{ id: 1 }],
        },
      },
    });
  }
};

export default seedEvents;
