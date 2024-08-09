exports.up = knex =>
  knex.schema.createTable('orders_items', table => {
    table.increments('id')
    table
      .integer('order_id')
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE')
    table
      .integer('dish_id')
      .references('id')
      .inTable('dishes')
      .onDelete('CASCADE')
    table.integer('amount')
    table.decimal('unit_price', 6, 2)
  })

exports.down = knex => knex.schema.dropTable('orders_items')
