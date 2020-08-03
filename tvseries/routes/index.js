const routes = require('express').Router()
const TvSeriesController = require('../controllers/TvSeriesController')

routes.get('/', TvSeriesController.findAll)
routes.post('/', TvSeriesController.create)
routes.get('/:id', TvSeriesController.findOne)
routes.patch('/:id', TvSeriesController.update)
routes.delete('/:id', TvSeriesController.deleteItem)

module.exports = routes