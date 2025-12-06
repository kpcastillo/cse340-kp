const express = require("express")
const router = new express.Router()
const Utilities= require("../utilities/index")
const messageController = require("../controllers/messageController")
const messageValidate = require("../utilities/message-validation")

// Route to build the message page
router.get("/add-message", Utilities.handleErrors(messageController.buildMessagePage))

// Route to handle message form submission
//router.post("/message/add-message", 
  //  messageValidate.messageFormRules(),
    //messageValidate.checkMessageData, 
    //Utilities.handleErrors(messageController.handleMessageForm))

// Build the messages management page
//router.get("/message/manage-management", 
  //  Utilities.checkLogin, 
    //Utilities.checkAdmin, 
    //Utilities.handleErrors(messageController.buildMessagesManagementPage))

module.exports = router