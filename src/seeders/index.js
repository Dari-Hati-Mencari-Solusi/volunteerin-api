import userSeeder from './user.seeder.js';
import categorySeeder from './category.seeder.js';
import eventSeeder from './event.seeder.js';
import partnerProfileSeeder from './partnerProfile.seeder.js';
import responsiblePersonSeeder from './responsiblePerson.seeder.js';

const seed = async () => {
  try {
    console.log('Seeding start! ⬇️⬇️')

    await userSeeder();
    await categorySeeder();
    await eventSeeder();
    await partnerProfileSeeder();
    await responsiblePersonSeeder();

    console.log('All seeds completed successfully ✅');
  } catch (error) {
    console.error('Error while seeding:', error);
  }
};

seed();
