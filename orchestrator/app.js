const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const errorHandler = require('./errorHandler')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/entertainme', routes)
app.use(errorHandler)
app.listen(3000, () => {
    console.log('connected to 3000')
})