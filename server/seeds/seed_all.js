exports.seed = async function (knex) {
  console.log('Deleting roles...');
  await knex('roles').del();

  // 1. Delete data from child tables first
  console.log('Deleting ads...');
  await knex('ads').del();

  console.log('Deleting sub_categories...');
  await knex('sub_categories').del();

  // 2. Delete data from parent tables after
  console.log('Deleting categories...');
  await knex('categories').del();

  console.log('Deleting users...');
  await knex('users').del();

  // 3. Run seeders in correct order
  console.log('Seeding roles...');
  await knex.seed.run({ specific: 'seed_roles.js' });

  console.log('Seeding users...');
  await knex.seed.run({ specific: 'seed_users.js' });

  console.log('Seeding categories...');
  await knex.seed.run({ specific: 'seed_categories.js' });

  console.log('Seeding sub_categories...');
  await knex.seed.run({ specific: 'seed_sub_categories.js' });

  console.log('Seeding ads...');
  await knex.seed.run({ specific: 'seed_ads.js' });

  console.log('✅ All seeding complete!');
};
