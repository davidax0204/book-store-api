const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')

const app = express()

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const jsPath = path.join(__dirname, '../public/js')



app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)



// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 

app.use(cookieParser())
// app.use(express.json())
// app.use(express.urlencoded())
app.use(userRouter)
app.use(express.static(jsPath))
app.use(express.static(publicDirectoryPath))


module.exports = app