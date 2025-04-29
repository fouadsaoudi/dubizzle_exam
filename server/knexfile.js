module.exports = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '@l8i1tUre',
        database: 'dubizzle_db',  // Default database that will be used in migrations
    },
    migrations: {
        directory: './migrations',  // Directory where migration files are stored
        tableName: 'knex_migrations', // Table for tracking migrations
    },

    // Run the database creation logic before starting migrations
    async onStart() {
        try {
            await createDatabase(); // Ensure the database exists
        } catch (err) {
            console.error('Error creating database:', err);
        }
    },
};
