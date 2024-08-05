exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.increments('id')
    table.text('name').notNullable()
    table.text('email').notNullable()
    table.text('password').notNullable()
    table
      .enum('role', ['admin', 'client'], {
        useNative: true,
        enumName: 'roles'
      })
      .notNullable()
      .default('client')
    table.timestamp('created_at').default(knex.fn.now())
  })

exports.down = knex => knex.schema.dropTable('users')
