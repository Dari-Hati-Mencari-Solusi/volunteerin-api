import userSeeder from './user.seeder.js';

const seed = async () => {
  await userSeeder(5);
};

seed();
