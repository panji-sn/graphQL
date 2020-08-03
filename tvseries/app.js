require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes')
const errorHandler = require('./errorHandler')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT_TV || 3002
mongoose.connect(process.env.MONGOOSE_URL_TV, {useUnifiedTopology:true, useCreateIndex: true, useNewUrlParser:true})
    .then (() => {
        console.log('database connected')
    })
    .catch(err => {
        console.log('error',err)
    })

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended:false }))
// app.get('/test', async (req, res) => {
//     let temp = await redis.get('users')
//     if (temp) {
//         res.send(JSON.parse(temp))
//     } else {
//         let {data} = await axios.get('http://localhost:3001/test')
//         redis.set('users', JSON.stringify(data))
//         res.send(data)
//     }
// })
app.use('/', routes)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log('connected to 3002')
})