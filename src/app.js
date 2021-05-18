const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user')
const hbs = require('hbs')

const app = express()


const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())
app.use(userRouter)
app.use(express.static(publicDirectoryPath))


module.exports = app