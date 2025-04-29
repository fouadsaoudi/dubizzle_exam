exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('categories').del();

  // Inserts seed entries
  await knex('categories').insert([
    { name: 'Electronics', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Vehicles', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Furniture', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Real Estate', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Jobs', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Fashion', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Sports & Outdoors', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Home Appliances', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Books', created_at: knex.fn.now(), updated_at: knex.fn.now() }
  ]);
};
