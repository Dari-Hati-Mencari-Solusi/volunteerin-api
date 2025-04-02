import { createUsers } from '../models/User.js';
import { hashPassword } from '../utils/crypto.js';
import { fakerID } from './seederConfig.js';

export default async () => {
  
  const roles = ['VOLUNTEER', 'PARTNER', 'ADMIN']
  const phoneNumbers = ['6282133276453', '6281222333444', '6282567654345'];

  const hashPw = await hashPassword('12345678');
  const now = new Date();

  const userData = Array.from({ length: roles.length }).map((num, index) => ({
    name: fakerID.person.fullName(),
    email: fakerID.internet.email({ provider: 'gmail.com' }),
    phoneNumber: phoneNumbers[index],
    password: hashPw,
    role: roles[index],
    verifiedAt: now
  }));

  await createUsers(userData);
  console.log('User data successfully seeded.')

};
