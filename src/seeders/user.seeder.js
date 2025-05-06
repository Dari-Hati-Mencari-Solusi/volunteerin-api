import { createUsers } from '../models/User.js';
import { hashPassword } from '../utils/crypto.js';
import { fakerID } from './seederConfig.js';

export default async () => {
  const hashPw = await hashPassword('12345678');
  const now = new Date();

  // Create basic users (1 volunteer, 1 admin)
  const basicUsers = [
    {
      name: fakerID.person.fullName(),
      email: fakerID.internet.email({ provider: 'gmail.com' }),
      phoneNumber: '6282133276453',
      password: hashPw,
      role: 'VOLUNTEER',
      verifiedAt: now,
    },
    {
      name: fakerID.person.fullName(),
      email: fakerID.internet.email({ provider: 'gmail.com' }),
      phoneNumber: '6282567654345',
      password: hashPw,
      role: 'ADMIN',
      verifiedAt: now,
    },
  ];

  // Create 5 partner users
  const partnerUsers = Array.from({ length: 5 }).map((_, index) => ({
    name: fakerID.company.name(),
    email: fakerID.internet.email({ provider: 'gmail.com' }),
    phoneNumber: `628123456${1000 + index}`,
    password: hashPw,
    role: 'PARTNER',
    verifiedAt: now,
  }));

  // Combine all users
  const userData = [...basicUsers, ...partnerUsers];

  await createUsers(userData);
  console.log('Data user berhasil di-seed: 1 volunteer, 5 partners, 1 admin');
};
