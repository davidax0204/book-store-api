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
        required: true
    },
    description:
    {
        type:String,
        required: true
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
        required: true
    },
    picture:
    {
        type: Buffer,
    }
})




const Book = mongoose.model('Book',bookSchema)

const bookEX = new Book({
    name:'Bob',
    author:'BobAuthor',
    description:'Bla Bla Bla',
    price: 23.5
})


const addBook = async ()=>
{
    try
    {
        await bookEX.save()
    }
    catch(e)
    {
        console.log(e)
    }
}

// addBook()

module.exports = Book