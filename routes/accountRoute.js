//Needed resources
const express = require("express")
const router = new express.Router()
const Utilities= require("../utilities/index")
const accountController = require("../controllers/accountController")

//Route to build the account login page
router.get("/login/", Utilities.handleErrors(accountController.buildLogin))

//Registration route to build the account registration page
router.get("/register/", Utilities.handleErrors(accountController.buildRegister))

router.post('/register', Utilities.handleErrors(accountController.registerAccount))

module.exports = router;