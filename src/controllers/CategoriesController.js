const knex = require('../database/knex')

class CategoriesController {
  async create(req, res) {
    const { name } = req.body

    await knex('categories').insert({ name })

    const category = await knex('categories')
      .where({ name })
      .first()
      .orderBy('id', 'desc')

    return res.json(category)
  }
}

module.exports = CategoriesController
