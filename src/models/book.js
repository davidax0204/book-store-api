const mongoose = require('mongoose')
const validator = require('validator')

const bookSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required: true,
        unique:true
    },
    author:
    {
        type:String,
    },
    description:
    {
        // type:String,
    },
    format:
    {
        type:String
    },
    dimensions:
    {
        type:String
    },
    publicationDate:
    {
        type:String
    },
    publisher:
    {
        type:String
    },
    publication:
    {   
        type:String
    },
    language:
    {
        type:String
    },
    price:
    {
        type: Number,
        // required: true
    },
    image:
    {
        type:String
    },
    owner: 
    {
        type: mongoose.Schema.Types.ObjectId
    }
})

const Book = mongoose.model('Book', bookSchema)


module.exports = Book