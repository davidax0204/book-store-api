const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

router.get('', async (req,res)=>
{
    res.render('index')
})


router.get('/sign-in', async (req,res)=>
{
    res.render('sign-in')
})


router.get('/sign-up', async (req,res)=>
{
    res.render('sign-up')
})


router.get('/profile',auth, async (req,res)=>
{
    const token = req.cookies['x-access-token'];
    const user = await User.findOne({'tokens.token': token})
    // console.log(user.name)
    res.render('profile',{
        userName:user.name,
        email:user.email
    })
    
})










router.post('/sign-up', async (req, res) => {
    const user = new User(req.body)

    try
    {
        await User.findExistingUsers(user.email)
        await user.save()
        const token = await user.generateAuthToken()

        let options = {
            path:"/",
            sameSite:true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }

        res.cookie('x-access-token',token, options) 
        
        res.redirect('/profile')
        // res.status(201).send({ user, token })
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})

router.post('/sign-in', async(req,res)=>
{
    try
    {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        let options = {
            path:"/",
            sameSite:true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }

        res.cookie('x-access-token',token, options) 
        res.redirect('/profile')

        // res.render('profile',{
        //     name: user.name,
        //     email:user.email,
        //     password:user.password,
        //     user:user,
        //     token:token
        // })
        // res.send({ user, token })
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})

router.post('/profile/logout',auth, async(req,res)=>
{

    try
    {
        req.user.tokens = req.user.tokens.filter((token)=>
        {
            return token.token !== req.token
        })
        await req.user.save()
        res.redirect('/profile')
    }
    catch(e)
    {
        res.status(500).send()
    }
})

router.post('/profile/logoutAll', auth, async(req,res)=>
{
    try
    {
        req.user.tokens = []
        await req.user.save()
        res.redirect('/profile')
    }
    catch (e)
    {
        res.status(500).send()
    }
})

router.patch('/profile/update', auth, async (req, res) => 
{
    // const updates = Object.keys(req.body)
    // const allowedUpdates = ['name', 'email', 'password', 'age']
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }

    console.log(req.body)
    
    // try {
    //     const user = req.user

    //     updates.forEach((update) => user[update] = req.body[update])
    //     await user.save()

    //     res.send(user)
    // } catch (e) {
    //     res.status(400).send(e)
    // }
})

module.exports = router