import mongoose from 'mongoose'

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
    },
    maxCuits: {
        type: Number,
        required: true,
    }
})

const usermodel = mongoose.model('Users' , userSchema)

export default usermodel