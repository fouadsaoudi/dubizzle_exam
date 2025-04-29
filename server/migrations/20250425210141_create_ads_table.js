exports.up = function (knex) {
    return knex.schema.createTable('ads', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.integer('sub_category_id').unsigned().notNullable();
        table.foreign('sub_category_id').references('id').inTable('sub_categories').onDelete('CASCADE');
        table.string('title').notNullable();
        table.text('description');
        table.string('location');
        table.decimal('price', 10, 2);
        table.enu('status', ['pending', 'approved', 'rejected']).defaultTo('pending');
        table.text('rejection_reason');

        // 👇👇👇 New columns
        table.integer('parent_ad_id').unsigned().nullable();
        table.foreign('parent_ad_id').references('id').inTable('ads').onDelete('CASCADE');
        table.boolean('is_active').defaultTo(true);

        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('ads');
};
