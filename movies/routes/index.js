const routes = require('express').Router()
const MovieController = require('../controllers/MovieController')

routes.get('/', MovieController.findAll)
routes.post('/', MovieController.create)
routes.get('/:id', MovieController.findOne)
routes.patch('/:id', MovieController.update)
routes.delete('/:id', MovieController.deleteItem)

module.exports = routes