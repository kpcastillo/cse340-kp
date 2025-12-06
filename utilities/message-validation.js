const utilities = require(".")
const { body, validationResults } = require("express-validator")
const messageModel = require("../models/message-model")
const validate = {}

/* ************************************
    * Contact Us form data validation
* ************************************ */
validate.messageFormRules = () => {
    return [
       // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.
         
         // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
         
         // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
    ]
}

/* **********************************
 * Check Message data
 ********************************** */
validate.checkMessageData = async ( req, res, next ) => {
    const { message_firstname, message_lastname, message_email} = req.body
    let errors = []
    errors = validationResults(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("message/add-message", {
            errors,
            title: "Contact Us",
            nav,
            message_firstname,
            message_lastname,
            message_email
        })
        return
    }
    next()
}
module.exports = validate