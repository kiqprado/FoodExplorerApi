const knex = require('../database/knex')

class CategoriesController {
  async create(req, res) {
    const { name } = req.body

    await knex('categories').insert({ name })

    const category = await knex('categories')
      .where({ name })
      .first()
      .orderBy('id', 'desc')

    return res.status(201).json(category)
  }

  async index(req, res) {
    const categoryOrder = [
      'Refeições',
      'Sobremesas',
      'Bebidas',
      'Acompanhamentos'
    ]

    const categories = await knex('categories').select('*')

    const sortedCategories = categories.sort((a, b) => {
      return categoryOrder.indexOf(a.name) - categoryOrder.indexOf(b.name)
    })

    return res.json(sortedCategories)
  }

  async delete(req, res) {
    const { name } = req.params

    await knex('categories').where({ name }).delete()

    return res.status(204).json()
  }
}

module.exports = CategoriesController
