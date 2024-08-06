const knex = require('../database/knex')

class DishesController {
  async create(req, res) {
    const { avatar, title, description, price, ingredients, category_name } =
      req.body
    // const { user_id } = req.params

    let categories = await knex('categories')
      .where({ name: category_name })
      .first()

    if (!categories) {
      const [category_id] = await knex('categories').insert({
        name: category_name
      })
      categories = { id: category_id, name: category_name }
    }

    const [dish_id] = await knex('dishes').insert({
      avatar,
      title,
      category_id: categories.id,
      description,
      price
    })

    const ingredientsInsert = ingredients.map(ingredient => {
      return {
        dish_id,
        name: ingredient
      }
    })

    await knex('ingredients').insert(ingredientsInsert)

    return res.json()
  }
}

module.exports = DishesController
