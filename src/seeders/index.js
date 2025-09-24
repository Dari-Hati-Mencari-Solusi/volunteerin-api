import userSeeder from './user.seeder.js';
import categorySeeder from './category.seeder.js';
import benefitSeeder from './benefit.seeder.js';
import eventSeeder from './event.seeder.js';
import partnerProfileSeeder from './partnerProfile.seeder.js';
import responsiblePersonSeeder from './responsiblePerson.seeder.js';
import formSeeder from './form.seeder.js';
import formResponseSeeder from './formResponse.seeder.js';
import notificationSeeder from './notification.seeder.js';

const seed = async () => {
  await userSeeder();
  await categorySeeder();
  await benefitSeeder();
  await eventSeeder();
  await partnerProfileSeeder();
  await responsiblePersonSeeder();
  await formSeeder();
  await formResponseSeeder();
  await notificationSeeder();
};

seed();
