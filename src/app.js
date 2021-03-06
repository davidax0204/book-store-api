const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user')
const bookRouter = require('../src/routers/book')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const hbs = require('hbs')
const fileUpload = require('express-fileupload')

const app = express()

app.use(fileUpload())

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const jsPath = path.join(__dirname, '../public/js')
const cssPath = path.join(__dirname, '../public/css')
const picturesPath = path.join(__dirname, '../public/pictures')



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
app.use(bookRouter)
app.use(express.static(jsPath))
app.use(express.static(cssPath))
app.use(express.static(picturesPath))
app.use(express.static(publicDirectoryPath))


module.exports = app