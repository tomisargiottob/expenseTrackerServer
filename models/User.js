const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role: {
        type: String,
        required: false,       
    },
    organization: {
        type: String,
        required: true,
        ref: 'Organization'
    }
})

const usermodel = mongoose.model('Users' , userSchema)

module.exports = usermodel