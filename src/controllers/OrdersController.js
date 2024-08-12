const knex = require('../database/knex')

const AppError = require('../utils/AppError')

const moment = require('moment-timezone')

class OrdersController {
  async create(req, res) {
    const user_id = req.user.id

    const SaoPauloTime = moment.tz(Date.now(), 'America/sao_Paulo')
    const formattedDate = SaoPauloTime.format('DD/MM - HH:mm')

    if (!user_id) {
      throw new AppError('Realize o login para acessar a página de pedidos.')
    }

    const [id] = await knex('orders').insert({
      user_id,
      created_at: formattedDate,
      updated_at: formattedDate
    })

    return res.json({ id })
  }

  async update(req, res) {
    const { id } = req.params
    const { status } = req.body

    const order = await knex('orders').where({ id }).first()

    if (!order) {
      throw new AppError('Pedido não encontrado.', 404)
    }

    await knex('orders').where({ id }).update({
      status
    })

    return res.status(202).json()
  }

  async index(req, res) {
    const order_all = await knex('order_items')
      .select([
        'orders.id',
        'orders.user_id',
        'orders.created_at',
        'orders.status'
      ])
      .innerJoin('orders', 'orders.id', 'order_items.order_id')
      .orderBy('created_at')
      .groupBy('order_id')

    const orderWithItems = await Promise.all(
      order_all.map(async order => {
        const items = await knex('order_items')
          .select([
            'dishes.title as dish_title',
            'order_items.amount',
            'order_items.order_id'
          ])
          .innerJoin('dishes', 'dishes.id', 'order_items.dish_id')
          .where('order_items.order_id', order.id)

        return {
          ...order,
          items
        }
      })
    )

    return res.json(orderWithItems)
  }

  async show(req, res) {
    const user_id = req.params.id

    const order_user = await knex('orders_items')
      .select([
        'orders.id',
        'orders.user_id',
        'orders.status',
        'orders.created_at'
      ])
      .innerJoin('orders', 'orders.id', 'order_items.order_id')
      .where('orders.user_id', user_id)
      .orderBy('created_at')
      .groupBy('order_id')

    const orderWithItems = await Promise.all(
      order_user.map(async order => {
        const items = await knex('order_items')
          .select([
            'dishes.title as dish_title',
            'order_items.order_id',
            'order_items.amount'
          ])
          .innerJoin('dishes', 'dish.id', 'order_items.dish_id')
          .where('order_items.order_id', order.id)

        return {
          ...order,
          items
        }
      })
    )

    return res.json(orderWithItems)
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('orders').where({ id }).delete()

    return res.status(204).json()
  }
}

module.exports = OrdersController
