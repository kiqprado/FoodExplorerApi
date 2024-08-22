const knex = require('../database/knex')

const DiskStorage = require('../providers/DiskStorage')

const AppError = require('../utils/AppError')

class DishesAvatarController {
  async create(req, res) {
    const { id } = req.params

    const { filename: avatar } = req.file

    const diskStorage = new DiskStorage()

    const dish = await knex('dishes').where({ id }).first()

    if (!dish) {
      throw new AppError('Não foi possível encontrar o Prato')
    }

    const filename = await diskStorage.saveFile(avatar)

    await knex('dishes').where({ id }).update({ avatar: filename })

    return res.json({ avatar: filename })
  }

  async update(req, res) {}
}

module.exports = DishesAvatarController
