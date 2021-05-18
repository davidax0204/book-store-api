const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.get('', async (req,res)=>
{
    res.render('index',{
        name:'David'
    })
})
router.get('/sign-in', async (req,res)=>
{
    res.render('sign-in')
})
router.get('/sign-up', async (req,res)=>
{
    res.render('sign-up')
})
router.get('/profile', async (req,res)=>
{
    res.render('profile')
})
router.post('/sign-up', async (req, res) => {
    const user = new User(req.body)

    try
    {
        await User.findExistingUsers(user.email)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
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
        res.render('profile',{
            username: user.name
        })
        // res.send({ user, token })
    }
    catch(e)
    {
        res.status(400).send(e.message)
    }
})

module.exports = router