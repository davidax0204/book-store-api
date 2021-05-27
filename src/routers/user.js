const express = require('express')
const User = require('../models/user')
const {auth,authAdmin} = require('../middleware/auth')
const url = require('url')
const { log } = require('console')
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

// router.get('/profile/admin', authAdmin, (req,res)=>
// {

    
//     res.render('admin-dashboard')
// })

router.get('/profile/admin/users',authAdmin, async (req,res)=>
{
    const users = await User.find({'adminTokens':{$size:0}})


    res.render('admin-users-page',{
        users:users
    })
})


// router.post('/profile/admin/users', authAdmin, async (req,res)=>
// {
//     try 
//     {
//         const users = await User.find({})
//         console.log('here?')
//         res.redirect('/profile/admin/users')

//         res.redirect(url.format({
//             pathname:"/profile/admin/users",
//             query: {
//                 errorMSG: finalError
//                 }
//             }));
//     } 
//     catch (e) 
//     {
//         res.status(500).send()
//     }
//     // res.redirect('/profile/admin')
// })



// router.get('/profile/admin/books',authAdmin, (req,res)=>
// {
//     // res.render('admin-dashboard')
// })

// router.post('/profile/admin/books',authAdmin, (req,res)=>
// {
//     res.redirect('/profile/admin/books')
// })


router.get('/profile',auth, async (req,res)=>
{
    const token = req.cookies['x-access-token'];
    const user = await User.findOne({'tokens.token': token})

    // console.log('user',token)
    // console.log(user.adminTokens.length)
    

    if(!req.query.errorMSG)
    {
        if(user.adminTokens.length>0)
        {
            res.render('profile',{
                userName:user.name,
                email:user.email,
                dashBoard:'DashBoard'
            })
        }
        else
        {
            res.render('profile',{
                userName:user.name,
                email:user.email,
            })
        }
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
    // console.log(req.query.errorMSG)
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
    // console.log(req.body)
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

        var finalError = ''

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

        var token;
        if(user.name==='admin' || user.adminTokens.length>0)
        {
            
            token = await user.generateAdminAuthToken()
        }

        token = await user.generateAuthToken()
        

        let options = {
            path:"/",
            sameSite:true,
            maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
            httpOnly: true, // The cookie only accessible by the web server
        }

        res.cookie('x-access-token',token, options) 

        if(user.adminTokens.length > 0)
        {
            res.redirect('/profile')
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
        // req.user.adminTokens = []
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

router.get('/profile/adminUpdate/user', authAdmin, async(req,res)=>
{
    console.log(req.query)
    const user = await User.findOne({_id:req.query.user})

    if(!req.query.errorMSG)
    {
        res.render('admin-user-update',{
            name:user.name,
            email:user.email,
            id:user.id
        })
    }

    if(req.query.errorMSG==='Email is Invalid')
        {
            res.render('admin-user-update',{
                name:user.name,
                email:user.email,
                id:user.id,
                emailErrorMSG:'Email is Invalid'
            })
        }
        else if(req.query.errorMSG==='Email is taken')
        {
            res.render('admin-user-update',{
                name:user.name,
                email:user.email,
                id:user.id,
                emailErrorMSG:'Email is taken'
            })
        }
        else if(req.query.errorMSG==='Name is Invalid')
        {
            res.render('admin-user-update',{
                name:user.name,
                email:user.email,
                id:user.id,
                nameErrorMSG:'Name is Invalid'
            })
        }
        else if(req.query.errorMSG==='Password is Invalid')
        {
            res.render('admin-user-update',{
                name:user.name,
                email:user.email,
                id:user.id,
                passwordErrorMSG:'Password is Invalid'
            })
        }

    
})

router.post('/profile/adminUpdate/user/:id', authAdmin, async(req,res)=>
{
    
    const updates = Object.keys(req.body)
    // console.log(updates)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) 
    {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try 
    {
        const user = await User.findOne({_id:req.params.id})
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.redirect(url.format({
            pathname:"/profile/adminUpdate/user",
            query: {
                user:req.params.id
            }
        }));

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
                    pathname:"/profile/adminUpdate/user",
                    query: {
                        errorMSG: 'Email is Invalid',
                        user:req.params.id
                    }
                }));
            }
            else if(error[0] === 'n')
            {
                res.redirect(url.format({
                    pathname:"/profile/adminUpdate/user",
                    query: {
                        errorMSG: 'Name is Invalid',
                        user:req.params.id
                    }
                }));
            }
            else if(e.errors.password)
            {
                res.redirect(url.format({
                    pathname:"/profile/adminUpdate/user",
                    query: {
                    errorMSG:'Password is Invalid',
                    user:req.params.id
                    }
                }));
            }
        }
        catch(e2)    
        {
            res.redirect(url.format({
                pathname:"/profile/adminUpdate/user",
                query: {
                errorMSG: 'Email is taken',
                user:req.params.id
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

router.post('/profile/adminUpdate/user/delete/:id',authAdmin, async (req,res)=>
{
    console.log('here')
    try
    {
        const user = await User.findOneAndDelete({'_id':req.params.id})
        console.log(user)
        res.redirect('/profile/admin/users')
    }
    catch(e)
    {   
        res.redirect(url.format({
            pathname:"/profile/adminUpdate/user",
            query: {
                user:req.params.id
            }
        }));
    }
})

router.post('/profile/adminUpdate/:id', authAdmin, async (req, res) => 
{

    try 
    {
        res.redirect(url.format({
            pathname:"/profile/adminUpdate/user",
            query: {
                user:req.params.id
            }
        }));

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
    }
})

module.exports = router