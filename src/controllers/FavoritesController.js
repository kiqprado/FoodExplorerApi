const knex = require('../database/knex')

const AppError = require('../utils/AppError')

class FavoritesController {
  async create(req, res) {
    const { id: user_id } = req.params
    const { dish_id } = req.body

    const getUser = await knex('users').where({ id: user_id }).first()

    if (!getUser) {
      throw new AppError('Usuário não encontrado.')
    }

    const [dish] = await knex('dishes').where({ id: dish_id }).first()

    if (!dish) {
      throw new AppError('Prato não encontrado.')
    }

    const alreadyFavorite = await knex('favorites')
      .where({ dish_id: dish.id, user_id })
      .first()

    if (alreadyFavorite) {
      throw new AppError('Este Prato já está em seus favoritos.')
    }

    await knex('favorites').insert({
      dish_id: dish.id,
      user_id
    })

    return res.status(201).json({ message: 'Adicionado a Favoritos.' })
  }

  async index(req, res) {
    const user_id = req.user.id

    const favorites = await knex('favorites')
      .innerJoin('dishes', 'favorites.dish_id', 'dishes.id')
      .where('favorites.user_id', user_id)
      .select('dishes.*')
      .groupBy('dish_id')

    return res.json(favorites)
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('favorites').where({ dish_id: id }).delete()

    return res.status(204).json()
  }
}

module.exports = FavoritesController
