import userSeeder from './user.seeder.js';
import categorySeeder from './category.seeder.js';
// import eventSeeder from './event.seeder.js';

const seed = async () => {
  try {
    await userSeeder(5);
    await categorySeeder();
    // await eventSeeder();

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error while seeding:', error);
  }
};

seed();
