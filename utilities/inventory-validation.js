const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  * Add Classification Data Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification.")
    ]
  }
/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
 validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors = errors.array()
      let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

module.exports = validate