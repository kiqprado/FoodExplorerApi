const { Router } = require('express')

const multer = require('multer')

const uploadConfig = require('../configs/upload')

const DishesController = require('../controllers/DishesController')
const DishesAvatarController = require('../controllers/DishesAvatarController')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const verifyUserAuthorization = require('../middlewares/verifyUserAuthorization')

const dishesRoutes = Router()

const upload = multer(uploadConfig.MULTER)

const dishesController = new DishesController()
const dishesAvatarController = new DishesAvatarController()

dishesRoutes.use(ensureAuthenticated)

dishesRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  dishesController.create
)
dishesRoutes.patch(
  '/avatar/:id',
  upload.single('avatar'),
  verifyUserAuthorization(['admin']),
  dishesAvatarController.create
)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.delete('/:id', dishesController.delete)

module.exports = dishesRoutes
