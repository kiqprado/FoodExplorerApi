const { Router } = require('express')

const FavoritesController = require('../controllers/FavoritesController')

const favoritesRoutes = Router()

const favoritesController =  new FavoritesController

favoritesRoutes.post('/', favoritesController.create)
favoritesRoutes.get('/', favoritesController.index)
favoritesRoutes.delete('/:id', favoritesController.delete)

module.exports = favoritesRoutes