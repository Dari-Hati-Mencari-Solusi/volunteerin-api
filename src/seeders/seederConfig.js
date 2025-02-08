import { id_ID, Faker } from '@faker-js/faker';

export const faker = new Faker();

export const fakerID = new Faker({
  locale: [id_ID],
});
