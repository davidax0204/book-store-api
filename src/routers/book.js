const express = require('express')
const router = new express.Router()
const Book = require('../models/book')
const {auth,authAdmin} = require('../middleware/auth')
const url = require('url')
const { update } = require('../models/book')

router.get('/book',(req,res)=>
{
    res.render('book-page')
})

router.get('/cart',(req,res)=>
{
    res.render('cart-page')
})


router.get('/profile/admin/books',authAdmin, async (req,res)=>
{
    const books = await Book.find({})
    console.log(books)
    res.render('admin-books-page',{
        books:books
    })
})

router.get('/profile/admin/createBook',authAdmin, async (req,res)=>
{
    res.render('admin-create-book')

    // res.render('admin-users-page',{
    //     books:users
    // })
})

router.post('/profile/admin/createBook', authAdmin, async (req,res)=>
{
    const book = new Book(req.body)

    console.log(book)

    try
    {
        await book.save()
        res.redirect('/profile/admin/books')
    }
    catch(e)
    {
        console.log(e)
        res.redirect('/profile/admin/createBook')
    }
})

router.get('/profile/admin/books/updateBook/:id', authAdmin, async (req,res)=>
{
    const book = await Book.findOne({'_id':req.params.id})
    res.render('admin-book-update',
    {
        book
    })
})

router.post('/profile/admin/books/updateBook/:id', authAdmin, async (req,res)=>
{
    const updates = Object.keys(req.body)
    try
    {
        const book = await Book.findOne({'_id':req.params.id})
        console.log('before',book)
        for(let i=0; i<updates.length; i++)
        {
            if(req.body[updates[i]])
            {
                book[updates[i]] = req.body[updates[i]]
            }
        }

        // const book = await Book.findOne({'_id':req.params.id})
        // updates.forEach((update) => book[update] = req.body[update])
        await book.save()
        res.redirect(url.format({
            pathname:`/profile/admin/books/updateBook/${req.params.id}`
        }));
    }
    catch(e)
    {
        console.log(e.message)
    }
})

router.post('/profile/admin/books/delete/:id', authAdmin, async (req,res)=>
{
    console.log('here')
    try
    {
        const book = await Book.findOneAndDelete({'_id':req.params.id})
        res.redirect('/profile/admin/books')
    }
    catch(e)
    {
        console.log(e.message)
    }
})

module.exports = router