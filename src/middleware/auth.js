const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) =>
{
    // console.log(req)
    try
    {
        const token = req.cookies['x-access-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        if(!user)
        {
            // to trigger the catch
            throw new Error()
        }
        // create a verubale inside of req names user with the datas of the fetched user
        req.token = token
        req.user = user
        // console.log('its ok')
        // console.log(req.body)
        next()
    }
    catch(e)
    {
        
        // res.status(401).send({error: 'please authenticate'})
        res.status(403).redirect('/sign-in')
        // res.render('sign-in')
        // console.error();
    }
}

module.exports = auth
