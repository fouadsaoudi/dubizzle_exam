module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,  // Default database that will be used in migrations
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
