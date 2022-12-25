const jwt = require("jsonwebtoken")
const customerModel = require("./models/CustomerModel")
const cardModel = require("./models/CardModel")
const validator = require("validator")

//================================================Authentication======================================================//

const authenticate = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"] 


        if (!token) {
            return res.status(400).send({ status: false, message: "token must be present in headers" })
        }
        else {
            jwt.verify(token, "Assignment", function (err, decodedToken) {

                if (err) {
                    if(err.message=="invalid token"){
                        return res.status(401).send({ status: false, message: "Token in not valid" })}

                    if(err.message=="jwt expired"){
                        return res.status(401).send({ status: false, message: "Token has been expired" })
                    }
                    return res.status(401).send({ status: false, message: err.message })

                }
                else{
                    req.loginUserId = decodedToken.customerId   
                    next()

                }
            })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//================================================authorisation======================================================//

const authorisation = async function (req, res, next) {
    try {

        let customerId = req.params.customerID

        if(customerId) {
            const checkId = validator.isUUID(customerId)
        if(!checkId){return res.status(400).send({status:false , message:"Please provide a valid UUID"})}
            
            let checkData = await customerModel.findOne({customerID:customerId,status:"ACTIVE"})
            
            if(!checkData){return res.status(404).send({ status: false, message: 'customer does not exists in this customerID' }) }

            let tokenCustomerId = req.loginUserId 

            if (tokenCustomerId != customerId) { return res.status(403).send({ status: false, message: "You are not authorised to perform this task 1" }) }

        }
        else {
            let Id = req.body.customerID
            const checkId = validator.isUUID(Id)
        if(!checkId){return res.status(400).send({status:false , message:"Please provide a valid UUID"})}
         
            
        let checkData = await customerModel.findOne({customerID:Id,status:"ACTIVE"})
            
        if(!checkData){return res.status(404).send({ status: false, message: 'customer does not exists in this customerID' }) }
            
            let tokenCustomerId = req.loginUserId
            if (Id != tokenCustomerId) { return res.status(403).send({ status: false, msg: 'You are not authorised to perform this activity' }) }

        }

        next();
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}




module.exports.authenticate=authenticate
module.exports.authorisation=authorisation
