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

    return res.status(201).json()
  }

  async show(req, res) {
    const { id } = req.params

    const dish = await knex('dishes').where({ id }).first()
    const ingredients = await knex('ingredients')
      .where({ dish_id: id })
      .orderBy('name')

    return res.json({
      ...dish,
      ingredients
    })
  }

  async index(req, res) {
    /* const { title, category_id } = req.query

    let dishes

    if (category_id) {
      dishes = await knex('dishes')
        .where({ category_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')
    }

    const ingredientsItems = await knex('ingredients').select('*')

    const dishWithIngredients = dishes.map(dish => {
      const dishIngredient = ingredientsItems.filter(
        ingredients => ingredients.dish_id === dish.id
      )

      return {
        ...dish,
        ingredients: dishIngredient
      }
    })

    return res.json(dishWithIngredients) */

    const { title, category_id, ingredients } = req.query

    let dishesQuery

    if (ingredients) {
      const filterIngredients = ingredients
        .split(',')
        .map(ingredient => ingredient.trim())

      dishesQuery = await knex('ingredients')
        .select('dishes.id', 'dishes.title')
        .innerJoin('ingredients', 'dishes.id', 'ingredients.dish_id')
        .whereIn('ingredients.name', filterIngredients)
        .whereLike('dishes.title', `%${title}%`)
        .groupBy('dishes.id')
    } else {
      dishesQuery = knex('dishes')
        .where({ category_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')
    }

    const dishes = await dishesQuery.select('dishes.*')

    const ingredientsItems = await knex('ingredients').select('*')

    const dishWithIngredients = dishes.map(dish => {
      const dishIngredient = ingredientsItems.filter(
        ingredient => ingredient.dish_id === dish.id
      )

      return {
        ...dish,
        ingredients: dishIngredient
      }
    })

    return res.json(dishWithIngredients)
  }

  async delete(req, res) {
    const { id } = req.params

    await knex('dishes').where({ id }).delete()

    return res.status(204).json()
  }
}

module.exports = DishesController
