const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        // minlength:3,
        validate(value)
        {
            for(let charIdx = 0; charIdx < value.length; charIdx += 1) {
                if (!validator.isAlpha(value[charIdx], 'en-US') && value[charIdx]!==' ')
                {
                    throw new Error('The name must contain letters only'); 
                }   
            }
            if(value.length<3)
            {
                throw new Error('Name is too short, 3 chars min')
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) 
            {
                throw new Error('Password cannot contain "password"')
            }
            if(value.length<7)
            {
                throw new Error('Password is too short, 7 chars min')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:
    {
        type: Buffer
    }
})

userSchema.statics.findExistingUsers = async function(email)
{
    const isDups = await User.find({email})
    if (isDups.length>0)
    {
        throw new Error('The email is taken')
    }
    
}

userSchema.methods.generateAuthToken = async function  ()
{
    const user = this 
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token:token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async(email,password)=>
{
    const user = await User.findOne({email})

    if (!user)
    {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
    {
        throw new Error('Unble to login')
    }

    return user
}

userSchema.pre('save',async function(next)
{
    const user = this
    
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User