const sqliteConnection = require('../database/sqlite')

const { hash, compare } = require('bcryptjs')

const AppError = require('../utils/AppError')

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const database = await sqliteConnection()

    const checkIfUserExists = await database.get(
      'SELECT * FROM users Where email = (?)',
      [email]
    )

    if (checkIfUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      'INSERT INTO users (name, email, password) VALUES ( ?, ?, ?)',
      [name, email, hashedPassword]
    )

    return res.status(201).json()
  }

  async update(req, res) {
    const { id } = req.params
    const { name, email, password, old_password } = req.body

    const database = await sqliteConnection()

    const user = await database('SELECT * FROM users WHERE id = (?)', [id])

    if(!user) {
      throw new AppError('Usuário não encontrado.')
    }

    const userFetchUpdatedEmail = await database('SELECT * FROM users WHERE email = (?)', [email])

    if(userFetchUpdatedEmail && userFetchUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password) {
      throw new AppError('Você deve informar a senha antiga para atualiza-lá.')
    }

    if(password && old_password) {
      const checkValidityOldPassword = await compare(old_password, user.password)

      if(!checkValidityOldPassword) {
        throw new AppError('A senha antiga não confere!')
      }

      user.password = await hash(password), 8
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?
      `,
      [user.name, user.email, user.password, id]
    )

    return res.json()
  }

  async index() {
    // Utilizado para listar vários registros.
  }

  async show() {
    // Utilizado para mostrar um registro em especifico.
  }

  async delete() {}
}

module.exports = UsersController
