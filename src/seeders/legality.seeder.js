import moment from "moment";
import { createLegality } from "../models/Legality.js";
import { getPartnerProfiles } from "../models/PartnerProfile.js";
import { fakerID } from "./seederConfig.js";

export default async () => {
  
  const partnerProfiles = await getPartnerProfiles();

  const legality = {
    partnerProfileId: partnerProfiles[0].id,
    nik: '127362473647364',
    fullName: fakerID.person.fullName(),
    phoneNumber: '6284321234567',
    position: 'leader',
    ktpUrl: 'https://ik.imagekit.io/rm7q1v1y0/dummy-ktp.png?updatedAt=1743233237862',
    createdAt: moment().toISOString()
  }

  await createLegality(legality);
  console.log('Legality successfully seeded.');
}