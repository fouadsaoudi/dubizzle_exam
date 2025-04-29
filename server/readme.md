create migration using knex

```
npx knex migrate:make create_users_table
```

run the migration from knexfile

```
npx knex migrate:latest --knexfile knexfile.js
```

delete the migrations

```
npx knex migrate:rollback --knexfile knexfile.js
```

create a seed file

```
npx knex seed:make seed_all
```

run the seeder file

```
npx knex seed:run --specific=seed_all.js
```
