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
    startDate:{
        type : Date,
    },
    endDate:{
        type : Date,
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
    items: [{
        description: {
            type: String,
            required: true,
        },
        units: {
            type: Number,
            required: true, 
        },
        iva: {
            type:Number,
            required: true,
        },
        unitValue: {
            type: Number,
            required: true,
        },
    }],
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
    version: {
        type: String
    }
}, {timestamps: true})

const invoiceModel = mongoose.model('Invoices' , invoiceSchema)

export default invoiceModel