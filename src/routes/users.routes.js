const { Router } = require('express')

const usersRoutes = Router()

usersRoutes.post('/', (req, res) => {
  const { name, email, password } = req.body

  res.status(201).json({ name, email, password })
})

module.exports = usersRoutes
