//Needed resources
const express = require("express")
const router = new express.Router()
const indexUtilities= require("../utilities/index")
const accountController = require("../controllers/accountController")

//Route to build the account login page
router.get("/login/", indexUtilities.handleErrors(accountController.buildLogin))

module.exports = router;