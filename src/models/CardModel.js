
const mongoose = require("mongoose")

const cardSchema = new mongoose.Schema({

    cardNumber:{type:String, required:true},
    cardType:{type:String, required:true , 
        enum: ["REGULAR", "SPECIAL",]},
    customerName:{type:String, required:true},
    vision:{type:String },
   
   
    customerID:{type:String, required:true,ref:'customerData' },
    status:{ 
        type: String,                                       
        enum: ["ACTIVE", "INACTIVE",],
        default:"ACTIVE"
        
    },  
 



},{timestamps:true})


module.exports = mongoose.model("cardData",cardSchema)