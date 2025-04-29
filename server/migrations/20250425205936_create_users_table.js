exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL');
        table.timestamps(true, true);  // created_at, updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
};
