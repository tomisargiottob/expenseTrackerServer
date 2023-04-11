import mongoose from 'mongoose'

const BalanceSchema = new mongoose.Schema({ 
    date : {
        type : Date,
        required : true
    },
    amount:{
        type : Number,
        required : true
    },
    cuit: {
        type: String,
        required: true,          
        ref: 'Cuits' 
    },
})

const balanceModel = mongoose.model('Balances' , BalanceSchema)

export default balanceModel