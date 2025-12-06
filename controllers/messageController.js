const Utilities = require("../utilities/index")
const messageModel = require("../models/message-model")
const jwt = require("jsonwebtoken")
const { parse } = require("dotenv")
require("dotenv").config()

/* ************************
 * Build the message page  *
************************ */
async function buildMessagePage(req, res, next) {
    let nav = await Utilities.getNav()
    res.render("message/add-message", {
        title: "Contact Us",
        nav,
        errors: null,
    })
}


module.exports = {buildMessagePage}