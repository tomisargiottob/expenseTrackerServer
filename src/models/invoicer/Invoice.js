import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema({ 
    number : {
        type : Number,
        required : true
    },
    date:{
        type : Date,
        required : true
    },
    invoiceType : {
        type : String,
        required : true
    },
    cuit: {
        type: String,
        required: true,          
        ref: 'Cuits' 
    },
    destinatary: {
        type: String,
        required: true,     
    },
    destinataryDocumentType: {
        type: String,
        required: true,       
    },
    destinataryDocument: {
        type: String,
        required: true,       
    },
    description: {
        type: String,
        required: true,
    },
    units: {
        type: Number,
        required: true, 
    },
    unitValue: {
        type: Number,
        required: true,
    },
    total: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
    },
    cae: {
        type: Number,
    },
}, {timestamps: true})

const invoiceModel = mongoose.model('Invoices' , invoiceSchema)

export default invoiceModel