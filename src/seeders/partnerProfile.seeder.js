import prisma from '../configs/dbConfig.js';
import { createPartnerProfile } from '../models/PartnerProfile.js';
import { fakerID } from './seederConfig.js';

export default async () => {
  const partnerUsers = await prisma.user.findMany({
    where: {
      role: 'PARTNER',
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (partnerUsers.length === 0) {
    console.log('No partner users found. Please run the user seeder first.');
    return;
  }

  const organizationTypes = [
    'CORPORATE',
    'UNIVERSITY',
    'COMMUNITY',
    'FOUNDATION',
    'GOVERNMENT',
  ];

  const profiles = [];

  for (const partner of partnerUsers) {
    const profile = {
      userId: partner.id,
      organizationType:
        organizationTypes[Math.floor(Math.random() * organizationTypes.length)],
      organizationAddress:
        fakerID.location.streetAddress() +
        ', ' +
        fakerID.location.city() +
        ', ' +
        fakerID.location.state(),
      instagram:
        partner.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') + '_official',
      information:
        fakerID.company.catchPhrase() + '. ' + fakerID.company.buzzPhrase(),
      status: 'VERIFIED',
      eventQuota: 10,
    };

    profiles.push(profile);

    await createPartnerProfile(profile);
    console.log(`Membuat profil untuk akun partner: ${partner.name}`);
  }

  console.log(`✅${profiles.length} profil partner berhasil di-seed.`);
};
