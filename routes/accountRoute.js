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
    '/register', regValidate.registrationRules(),
    regValidate.checkRegData,
    Utilities.handleErrors(accountController.registerAccount))


// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Utilities.handleErrors(accountController.accountLogin)
)
//New default route for accounts
router.get("/", 
  Utilities.checkLogin,
  Utilities.handleErrors(accountController.buildAccountManagement))

// Route to log user out
router.get(
  "/logout",
  Utilities.handleErrors(accountController.accountLogout)
)

//Route for Update account information route
router.get("/update-account/:account_id", 
  Utilities.checkLogin,
  Utilities.handleErrors(accountController.buildUpdateAccount))

//Process update account information
router.post(
  "/update-account",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  Utilities.handleErrors(accountController.updateAccountInfo)
)
//Build the password update view
router.get("/update-password/:account_id",
  Utilities.checkLogin,
  Utilities.handleErrors(accountController.buildPasswordUpdate))

//Process password update
router.post(
  "/update-password",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordUpdateData,
  Utilities.handleErrors(accountController.updatePassword)
)
module.exports = router;