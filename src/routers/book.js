const express = require('express')
const router = new express.Router()
const Book = require('../models/book')
const {auth,authAdmin} = require('../middleware/auth')
const url = require('url')
const { update } = require('../models/book')
const multer = require('multer')
const sharp = require('sharp')
const fileUpload = require('express-fileupload')

router.get('', async (req,res)=>
{
    const books = await Book.find({}) 

    res.render('index',{
        books
    })
})

router.get('/book/:id', async (req,res)=>
{
    const book = await Book.findOne({'_id':req.params.id})
    // console.log(book)
    res.render('book-page',{
        book
    })

})

// router.get('/book',(req,res)=>
// {
//     res.render('book-page')
// })

router.get('/cart',(req,res)=>
{
    res.render('cart-page')
})


router.get('/profile/admin/books',authAdmin, async (req,res)=>
{
    const books = await Book.find({})
    // console.log(books)
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

    if(!book.image)
    {
        book.image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png'
    }
    
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
        // console.log('before',book)
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

// router.post('/upload-avatar', async (req,res)=>
// {
//     // console.log(req.files)
//     try {
//         if(!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
//             let avatar = req.files.avatar;
//             console.log(avatar)
            
//             //Use the mv() method to place the file in upload directory (i.e. "uploads")
//             avatar.mv('../uploads' + avatar.name);
//             console.log('herer')

//             //send response

//             const book = await Book.findOne({"_id":"60b4fc1f8b61a351d8cadc58"})
//             book.image = avatar
//             book.save()
//             console.log('he')
//             res.send({
//                 status: true,
//                 message: 'File is uploaded',
//                 data: {
//                     name: avatar.name,
//                     mimetype: avatar.mimetype,
//                     size: avatar.size
//                 }
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// })


module.exports = router