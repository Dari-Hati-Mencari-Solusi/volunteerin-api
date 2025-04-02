import { createPartnerProfile } from "../models/PartnerProfile.js";
import { getUsers } from "../models/User.js"

export default async () => {
  const users = await getUsers();

  const partnerProfile = {
    userId: users[1].id,
    organizationType: 'COMMUNITY',
    organizationAddress: 'GG Kapuas, Condongcatur, Depok, Sleman, Yogyakarta',
    instagram: 'amccamikom',
    status: 'VERIFIED',
  }

  await createPartnerProfile(partnerProfile);
  console.log('Partner Profile successfully seeded.');
}