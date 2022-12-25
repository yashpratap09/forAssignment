const joi = require("joi")

module.exports = {

    customerModel: joi.object({
        firstName: joi.string().required().trim(),
        lastName: joi.string().required().trim(),
        mobileNumber: joi.string().required().trim().pattern(/^[0]?[6789]\d{9}$/),
        DOB: joi.string().required().pattern(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/).message("date must be dd/mm/yyyy, dd-mm-yyyy or dd.mm.yyyy.  pattern"),
        emailID: joi.string().required().email().trim(),
        address: joi.string().required().trim(),
        customerID: joi.string().required().trim(),
        status: joi.string().required().valid("ACTIVE", "INACTIVE")


    }).unknown(true),
  

    cardModel: joi.object({

        cardNumber:joi.string().required().trim(),
        cardType:joi.string().required().valid("REGULAR", "SPECIAL").trim().message("cardType in REGULAR or SPECIAL "),
        customerName:joi.string().required().trim(),
        vision:joi.string().required().trim(),
        customerID:joi.string().required().trim(),
        status:joi.string().required().valid("ACTIVE", "INACTIVE")




    }).unknown(true)

}