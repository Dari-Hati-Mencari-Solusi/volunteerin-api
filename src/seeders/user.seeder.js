import { createUser } from '../models/User.js';
import { hashPassword } from '../utils/crypto.js';
import { fakerID } from './seederConfig.js';

export default async (loopCount) => {
  const users = Array.from({ length: loopCount }).map(() => ({
    name: fakerID.person.fullName(),
    email: fakerID.internet.email({ provider: 'gmail.com' }),
    phoneNumber: fakerID.phone.number(),
    password: hashPassword('12345678'),
  }));

  await createUser(users);
};
