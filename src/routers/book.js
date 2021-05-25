const express = require('express')
const router = new express.Router()
const Book = require('../models/book')

router.get('/book',(req,res)=>
{
    res.render('book-page')
})

router.get('/cart',(req,res)=>
{
    res.render('cart-page')
})



module.exports = router