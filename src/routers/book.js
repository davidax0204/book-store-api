const express = require('express')
const router = new express.Router()

router.get('/book',(req,res)=>
{
    res.render('book-page')
})

module.exports = router