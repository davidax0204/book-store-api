const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user')

const app = express()

app.use(express.json())
app.use(userRouter)

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

module.exports = app