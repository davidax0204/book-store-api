const express = require('express')
const User = require('../models/user')
const bodyParser = require('body-parser')
const router = new express.Router()

// const urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(bodyParser.urlencoded({ extended: false }))

// var bodyParser = require('body-parser')

router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// const path = require('path')

// router.use(express.static(path.join(__dirname, '../../public')))

router.get('', (req,res)=>
{
    res.render('index',{
        name:'David'
    })
})
router.get('/sign-in',(req,res)=>
{
    res.render('sign-in')
})
router.get('/sign-up',(req,res)=>
{
    res.render('sign-up')
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router