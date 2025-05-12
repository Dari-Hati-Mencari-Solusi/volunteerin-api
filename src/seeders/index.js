import userSeeder from './user.seeder.js';
import categorySeeder from './category.seeder.js';
import benefitSeeder from './benefit.seeder.js';
import eventSeeder from './event.seeder.js';
import partnerProfileSeeder from './partnerProfile.seeder.js';
import responsiblePersonSeeder from './responsiblePerson.seeder.js';
import formSeeder from './form.seeder.js';

const seed = async () => {
  try {
    console.log('Seeding dimulai! ⬇️⬇️');

    await userSeeder();
    console.log('✅ User seeder selesai');

    await categorySeeder();
    console.log('✅ Category seeder selesai');

    await benefitSeeder();
    console.log('✅ Benefit seeder selesai');

    await eventSeeder();
    console.log('✅ Event seeder selesai');

    await partnerProfileSeeder();
    console.log('✅ Partner profile seeder selesai');

    await responsiblePersonSeeder();
    console.log('✅ Responsible person seeder selesai');

    await formSeeder();
    console.log('✅ Form seeder selesai');


    console.log('Semua seeder berhasil dijalankan ✅');
  } catch (error) {
    console.error('Error saat menjalankan seeder:', error);
  }
};

seed();
