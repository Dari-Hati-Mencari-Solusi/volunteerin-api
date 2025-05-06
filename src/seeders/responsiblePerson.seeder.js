import moment from 'moment';
import { createResponsiblePerson } from '../models/ResponsiblePerson.js';
import { getPartnerProfiles } from '../models/PartnerProfile.js';
import { fakerID } from './seederConfig.js';

export default async () => {
  const partnerProfiles = await getPartnerProfiles();

  if (partnerProfiles.length === 0) {
    console.log(
      'Tidak ada partner profil yang ditemukan. coba jalankan partnerProfile seeder terlebih dahulu.',
    );
    return;
  }

  console.log(
    `Ditemukan ${partnerProfiles.length} profil partner. Membuat legalitas...`,
  );

  const positions = [
    'CEO',
    'Executive Director',
    'Program Manager',
    'Head of Community Relations',
    'Community Outreach Director',
    'Volunteer Coordinator',
    'CSR Manager',
  ];

  for (const profile of partnerProfiles) {
    const responsiblePerson = {
      partnerProfileId: profile.id,
      nik: fakerID.number
        .int({ min: 1000000000000000, max: 9999999999999999 })
        .toString(),
      fullName: fakerID.person.fullName(),
      phoneNumber: `628${fakerID.number.int({ min: 1000000000, max: 9999999999 })}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      ktpImageId: `ktp_${profile.id.substring(0, 8)}`,
      ktpUrl:
        'https://ik.imagekit.io/rm7q1v1y0/dummy-ktp.png?updatedAt=1743233237862',
      createdAt: moment().toISOString(),
    };

    await createResponsiblePerson(responsiblePerson);
    console.log(
      `Membuat legalitas: ${responsiblePerson.fullName} untuk partner dengan id: ${profile.id}`,
    );
  }

  console.log(`✅${partnerProfiles.length} Legalitas berhasil di-seed`);
};
