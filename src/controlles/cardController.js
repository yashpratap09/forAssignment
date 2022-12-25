
const cardModel = require("../models/CardModel")
const counterModel = require("../models/counterModel")
const customerModel = require("../models/CustomerModel")
const joiValidation = require("../validation/joivalidation")
const validator = require('validator')

const createCard = async function(req,res){
    try{

        data = req.body 
        let{customerID ,status }  = data
        if(!status){
            data.status = "ACTIVE"
           }   
           const checkId = validator.isUUID(customerID)
           if(!checkId){return res.status(400).send({status:false , message:"Please provide a valid UUID"})}
           const checkCustomer = await cardModel.findOne({customerID:customerID})
           if(checkCustomer){return res.status(409).send({status:false , message:"Card is already exists in this customerID"})}
        const Name = await customerModel.findOne({customerID:data.customerID , status:"ACTIVE" }).select({_id:0, firstName:1 , lastName:1 })
        if(!Name){ return res.status(404).send({status:false , message:"Data not found in this customerID"})}

        
        data.customerName = Name.firstName +" "+ Name.lastName
        
        //====================================================================================================================================//
       counterModel.findOneAndUpdate(
        {cardNumber:"autoval"} , {"$inc":{"seq":1}},{new:true},(err,cd)=>{
            
            
            if(cd==null){
                const newval = new counterModel({cardNumber:"autoval",seq:1})
                newval.save()
                seqId=1
            }else{
              seqId=cd.seq
            }
            
        }
      )
      const sub = await counterModel.findOne({cardNumber:"autoval"}).select({_id:0,seq:1} )
      
      data.cardNumber = ("C00"+sub.seq)
      //==========================================================================================================================================//




        const {error} = joiValidation.cardModel.validate(data)

     if(error){  
         return res.status(400).send({ status: false, message: error.message })
    }

        const cardData = await cardModel.create(data)
        return res.status(201).send({status:true , data:data})

    }catch(error){
        return res.status(500).send({ error: error.message })
    }
}



const getCard = async function(req,res){
    try{

    const getData = await cardModel.find()
    const count = await cardModel.find().count()
    return res.status(200).send({status:true ,count:count, data:getData})
    }catch(error){
        return res.status(500).send({ error: error.message })

    }
}


module.exports.createCard=createCard
module.exports.getCard=getCard
