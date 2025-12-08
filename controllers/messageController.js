const Utilities = require("../utilities/index")
const messageModel = require("../models/message-model")
const jwt = require("jsonwebtoken")
const { parse } = require("dotenv")
require("dotenv").config()

/* ****************************************
 * Build the message page  
* *************************************** */
async function buildMessagePage(req, res, next) {
    let nav = await Utilities.getNav()
    res.render("message/add-message", {
        title: "Contact Us",
        nav,
        errors: null,
    })
}
/* ****************************************
 * Process message form
* *************************************** */
async function handleMessageForm(req, res, next) {
    let nav = await Utilities.getNav()
    const { message_firstname, message_lastname, message_email, message_subject, message_body} = req.body

    const messageData = await messageModel.handleMessageForm(

    message_firstname, 
    message_lastname, 
    message_email, 
    message_subject, 
    message_body
    )
    if (messageData) {
        req.flash(
            "notice",
            "Congratulations your message was sent successfully."
        )
        res.status(201).render("message/add-message", {
        title: "Contact Us",
        nav,
        errors: null,
    })
 } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("message/add-message", {
        title:"Contact Us",
        nav,
        errors: null
    })
    }
}

/* ****************************************
 * Build the message view for admin accounts
* *************************************** */
async function buildMessagesManagementPage( req, res, next) {
    const msgData = await messageModel.getMessages()
    const msgView = await Utilities.buildMsgView(msgData)
    let nav = await Utilities.getNav()
        res.render("message/management", {
            title: "Message Management",
            nav,
            msgView,
            errors: null
        })
}


module.exports = {buildMessagePage, handleMessageForm, buildMessagesManagementPage}