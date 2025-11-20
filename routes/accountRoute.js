//Needed resources
const express = require("express")
const router = new express.Router()
const Utilities= require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Route to build the account login page
router.get("/login/", Utilities.handleErrors(accountController.buildLogin))

//Registration route to build the account registration page
router.get("/register/", Utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    '/register', regValidate.registationRules(),
    regValidate.checkRegData,
    Utilities.handleErrors(accountController.registerAccount))

module.exports = router;