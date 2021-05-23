const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Email is invalid')
        //     }
        // }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
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