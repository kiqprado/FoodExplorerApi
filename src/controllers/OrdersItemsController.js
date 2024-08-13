const knex = require('../database/knex')

const AppError = require('../utils/AppError')

class OrdersItemsController {
  async create(req, res) {
    const { items, order_id } = req.body

    const orderNumber = await knex('orders').where({ id: order_id }).first()

    if (!orderNumber) {
      throw new AppError('Número de pedido não encontrado.')
    }

    const itemsInsert = items.map(item => {
      return {
        order_id,
        dish_id: item.dish_id,
        amount: item.amount,
        unit_price: item.unit_price
      }
    })

    await knex('order_items').insert(itemsInsert)

    return res.status(201).json()
  }
}

module.exports = OrdersItemsController
