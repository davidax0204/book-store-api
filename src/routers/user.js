const express = require('express')
const User = require('../models/user')
const {auth,authAdmin} = require('../middleware/auth')
const url = require('url')
// const { Console } = require('console')
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

router.get('/profile/admin', authAdmin, (req,res)=>
{

    
    res.render('admin-dashboard')
})

router.get('/profile',auth, async (req,res)=>
{
    const token = req.cookies['x-access-token'];
    const user = await User.findOne({'tokens.token': token})

    console.log(req.query)

    if(!req.query.errorMSG)
    {
        res.render('profile',{
            userName:user.name,
            email:user.email
        })
    }
    else
    {
        if(req.query.errorMSG==='Email is Invalid')
        {
            res.render('profile',{
                userName:user.name,
                email:user.email,
                emailErrorMSG:'Email is Invalid'
            })
        }
        else if(req.query.errorMSG==='Email is taken')
        {
            res.render('profile',{
                userName:user.name,
                email:user.email,
                emailErrorMSG:'Email is taken'
            })
        }
        else if(req.query.errorMSG==='Name is Invalid')
        {
            res.render('profile',{
                userName:user.name,
                email:user.email,
                nameErrorMSG:'Name is Invalid'
            })
        }
        else if(req.query.errorMSG==='Password is Invalid')
        {
            res.render('profile',{
                userName:user.name,
                email:user.email,
                passwordErrorMSG:'Password is Invalid'
            })
        }
        
    }
})



router.get('/sign-in/error', (req,res)=>
{
    console.log(req.query.errorMSG)
    res.render('sign-in',{
        errorMSG: req.query.errorMSG
    })
})

router.get('/sign-up/error', (req,res)=>
{   
    // res.send(req.query)
    res.render('sign-up',{
        errorMSG:req.query.errorMSG
    })
})




router.post('/sign-up', async (req, res) => {
    // console.log('here')
    const user = new User(req.body)
    console.log(req.body)
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
    }
    catch(e)
    {
        // res.send(e)
        // const error = e.message.substr(24)
        var finalError = ''

        // res.send(e)

        // res.send(e.length)
        try
        {
            if (e.errors.name)
            {
                finalError = e.errors.name.message + ' & '
            }
            if(e.errors.email)
            {   
                finalError += e.errors.email.message + ' & '
            }
            if(e.errors.password)
            {
                finalError += e.errors.password.message
            }
        }
        catch(e2)
        {
            finalError += 'email is taken'
        }
        
        // finalError = 'boo'
        // res.send(error)
        // res.send(finalError)

        res.redirect(url.format({
            pathname:"/sign-up/error",
            query: {
                errorMSG: finalError
                }
            }));
    }
})

router.post('/sign-in', async(req,res)=>
{
    // console.log(req.body)
    try
    {
        
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // console.log(user)
        var token;
        if(user.name==='admin')
        {
            
            token = await user.generateAdminAuthToken(req.body.email, req.body.password)
        }
        
        token = await user.generateAuthToken()
        // console.log('here now2')

        let options = {
            path:"/",
            sameSite:true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }

        res.cookie('x-access-token',token, options) 

        if(user.adminTokens.length > 0)
        {
            res.redirect('/profile/admin')
        }
        else
        {
            res.redirect('/profile')
        }
        

    }
    catch(e)
    {
        res.redirect(url.format({
            pathname:"/sign-in/error",
            query: {
                errorMSG: 'The email or the password or both wrong'
                }
            }));
    }
})

router.post

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

router.post('/profile/update', auth, async (req, res) => 
{

    const updates = Object.keys(req.body)
    // console.log(updates)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) 
    {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.redirect('/profile')

    } catch (e) 
    {
        // res.send(e)
        const error = e.message.substr(24)
        const finalError = ''
        // res.send(error)
        try
        {
            if(error[0] === 'e')
            {
                res.redirect(url.format({
                    pathname:"/profile",
                    query: {
                    errorMSG: 'Email is Invalid'
                    }
                }));
            }
            else if(error[0] === 'n')
            {
                res.redirect(url.format({
                    pathname:"/profile",
                    query: {
                    errorMSG: 'Name is Invalid'
                    }
                }));
            }
            else if(e.errors.password)
            {
                res.redirect(url.format({
                    pathname:"/profile",
                    query: {
                    errorMSG: 'Password is Invalid'
                    }
                }));
            }
        }
        catch(e2)    
        {
            res.redirect(url.format({
                pathname:"/profile",
                query: {
                errorMSG: 'Email is taken'
                }
            }));
        }    


        // res.redirect(url.format({
        //     pathname:"/profile",
        //     query: {
        //        errorMSG: finalError
        //      }
        //   }));
        // res.send(e.errors.name.properties.message)
    }
})

module.exports = router