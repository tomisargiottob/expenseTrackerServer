import mongoose from 'mongoose'

const cuitSchema = new mongoose.Schema({ 
    fullname : {
        type : String,
        required : true
    },
    cuit:{
        type : String,
        required : true
    },
    registerType : {
        type : String,
        required : true
    },
    salePoint: {
        type: String,
        required: true,       
    },
    balance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Balances'      
    },
    address: {
        type: String,
        required: true,       
    },
    initAct: {
        type: Date,
        required: true,       
    },
    organization: {
        type: String,
        required: true,
        ref: 'Organization'
    },
    staticVat: {
        type: Boolean,
        required: true,
    },
    vat: {
        type: Number,
        required: false,
    },
    certificate: {
        type: String,
        required: true,
        
    },
    privateKey: {
        type: String,
        required: true,
    }
})

const cuitModel = mongoose.model('Cuits' , cuitSchema)

export default cuitModel