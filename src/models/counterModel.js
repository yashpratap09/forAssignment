const mongoose = require("mongoose")

const counterSchema =  mongoose.Schema({
    cardNumber: {
        type:String
    },
    seq : {
        type:Number
    }
})







module.exports = mongoose.model("counter",counterSchema)