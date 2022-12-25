const express = require("express")
const router = express.Router()
const customerController = require("../controlles/CustomerController")
const cardController = require("../controlles/cardController")
const auth = require("../auth")


router.post("/createCustomer",customerController.createCustomer)
router.post("/loginCustomer",customerController.userLogin)
router.delete("/deleteCustomer/:customerID",auth.authenticate,auth.authorisation,customerController.deleteCustomer)
router.get("/getcustomer",auth.authenticate,customerController.getCustomer)


router.post("/createCard",auth.authenticate,auth.authorisation,cardController.createCard)
router.get("/getCard",auth.authenticate,cardController.getCard)








module.exports = router