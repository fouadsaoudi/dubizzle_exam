const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Fetch roles
  const roles = await knex('roles').select('id', 'name');
  const roleMap = {};
  roles.forEach(role => {
    roleMap[role.name] = role.id;
  });

  // Inserts seed entries with role assignments
  await knex('users').insert([
    {
      username: 'user1',
      password: await bcrypt.hash('12345678', 10),
      role_id: roleMap['admin'], // assign as admin
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      username: 'user2',
      password: await bcrypt.hash('password123', 10),
      role_id: roleMap['user'],
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      username: 'user3',
      password: await bcrypt.hash('password123', 10),
      role_id: roleMap['user'],
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      username: 'user4',
      password: await bcrypt.hash('password123', 10),
      role_id: roleMap['user'],
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      username: 'user5',
      password: await bcrypt.hash('password123', 10),
      role_id: roleMap['user'],
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }
  ]);
};
