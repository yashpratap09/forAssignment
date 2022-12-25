const customerModel = require("../models/CustomerModel")
const joiValidation = require("../validation/joivalidation")
const {v4 : uuidv4} = require('uuid')
const validator = require('validator')
const cardModel = require("../models/CardModel")
const jwt = require("jsonwebtoken")

const createCustomer = async function(req,res){
    try{

        data = req.body
       let status = req.body.status
       if(!status){
        data.status = "ACTIVE"
       }
       data.customerID = uuidv4()
        const {error} = joiValidation.customerModel.validate(data)

     if(error){  
         return res.status(400).send({ status: false, message: error.message })
    }else{
        const mobile = await customerModel.findOne({mobileNumber:data.mobileNumber})
        if(mobile){return res.status(409).send({status:false , message:"Mobile number is already exists"})}

        const emailID = await customerModel.findOne({emailID:data.emailID})
        if(emailID){return res.status(409).send({status:false , message:"emailID is already exists"})}
        const customerID = await customerModel.findOne({customerID:data.customerID})
        if(customerID){return res.status(409).send({status:false , message:"customerID is already exists"})}
        const customerData = await customerModel.create(data)
        return res.status(200).send({status:true , data:data})
    }

    }catch(error){
        return res.status(500).send({ error: error.message })
    }
}

const getCustomer = async function(req,res){
    try{

    const getData = await customerModel.find({status:"ACTIVE"})
  if(getData.length==0){
    return res.status(404).send({status:false , message:"Data not found"})
  }
    return res.status(200).send({status:true , data:getData})
    
    }catch(error){
        return res.status(500).send({ error: error.message })

    }
}


const deleteCustomer = async function(req,res){
    try{

        const customerId = req.params.customerID
        const checkId = validator.isUUID(customerId)
        if(!checkId){return res.status(400).send({status:false , message:"Please provide a valid UUID"})}
        const deleteData = await customerModel.findOneAndUpdate({customerID: customerId,status:"ACTIVE"} , {$set:{status:"INACTIVE"}},{new:true})
        if(deleteData!==null){
            const deleteCard = await cardModel.findOneAndUpdate({customerID: customerId,status:"ACTIVE"} , {$set:{status:"INACTIVE"}},{new:true})
        }
        if(deleteData==null){ return res.status(404).send({status:false , message:"Data not found / Data already deleted"})}
        
        return res.status(200).send({status:true , message:"Data successfully deleted"})

        


    }catch(error){
         return res.status(500).send({ error: error.message })
    }
}



//===================================================================================================//
 

const userLogin = async function (req, res) {
    try {
              let {emailID , customerID}= req.body

              const checkId = validator.isUUID(customerID)
              if(!checkId){return res.status(400).send({status:false , message:"Please provide a valid UUID"})}

              const checkemail = validator.isEmail(emailID)
              if(!checkemail){return res.status(400).send({status:false , message:"Please provide a valid email"})}
              
              
              
        let customerDetail = await customerModel.findOne({ customerID: customerID, emailID: emailID }).select({_id:0, customerID:1})
        if (!customerDetail) {
            return res.status(404).send({ status: false, message: "User not found with this EmailId and UUID" })
        }

        let token = jwt.sign({                                   
            customerId: customerDetail.customerID.toString(),

        }, "Assignment", { expiresIn: '30m' })
        res.setHeader("x-api-key", token)              

        return res.status(200).send({ status: true, message: "Success", data: token })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}















module.exports.createCustomer=createCustomer
module.exports.getCustomer=getCustomer
module.exports.deleteCustomer=deleteCustomer
module.exports.userLogin=userLogin
