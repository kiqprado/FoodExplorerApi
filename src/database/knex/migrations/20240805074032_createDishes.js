exports.up = knex =>
  knex.schema.createTable('dishes', table => {
    table.increments('id')
    table.text('avatar').default(null)
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.decimal('price', 8, 2)
    table.integer('category_id').references('id').inTable('categories')
  })

  exports.down = knex => knex.schema.dropTable('dishes')
