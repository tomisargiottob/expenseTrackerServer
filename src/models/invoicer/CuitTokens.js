import mongoose from 'mongoose'

const cuitTokenSchema= new mongoose.Schema({ 
    cuit:{
        type : String,
        required : true,
        ref: 'Cuits'
    },
    token : {
        type : String,
        required : true
    },
    sign: {
        type: String,
        required: true,       
    },
    expirationTime: {
        type: String,
        required: true,      
    },
}, {timestamps: true})
cuitTokenSchema.index({createdAt: 1},{expireAfterSeconds: 600});

const cuitTokenModel = mongoose.model('CuitTokens' , cuitTokenSchema)

export default cuitTokenModel