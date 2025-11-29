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

/*  **********************************
  * Add Inventory Data Validation Rules
  * ********************************* */
  validate.inventoryRules = () => {
    return [ 
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a make."),
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a model."),
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max: 4 })
        .withMessage("Year needs to be a four digit number."),
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a description."),
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Price needs to be a valid number, no comas or dollar signs."),
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Mileage needs to be a valid number, no comas."),
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a color."),
        body("classification_id")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Please select a classification.")
    ]
  }
/* ******************************
 * Check data and return errors or continue to add inventory item
 * ***************************** */
 validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors = errors.array()
      let nav = await utilities.getNav()

      const classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
          title: "Add Inventory",
          nav,
          errors,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_price,
          inv_miles,
          inv_color,
          classificationList,
          classification_id,
        })
      return
    }
    next()
  }


  /* ******************************
 * Check data and return errors or continue to edit inventory item
 * ***************************** */
 validate.checkUpdateData = async (req, res, next) => {
    const {  inv_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors = errors.array()
      let nav = await utilities.getNav()

      const classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
          title: "Edit Inventory",
          nav,
          errors,
          inv_id,
          inv_make,
          inv_model,
          inv_description,
          inv_price, 
          inv_year,
          inv_miles,
          inv_color,
          classificationList,
          classification_id,

        })
      return
    }
    next()
  }

/* ******************************
 * Check data and return errors or continue to delete inventory item
 * ***************************** */
 validate.checkDeleteData = async (req, res, next) => {
    const { inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      errors = errors.array()
      let nav = await utilities.getNav()

      const itemData = await require("../models/inventory-model").getInventoryByItemId(inv_id)
      const itemName = itemData.inv_make + " " + itemData.inv_model

        res.render("inventory/delete-confirm", {
          title: "Delete " + itemName,
          nav,
          errors,
          inv_id: itemData.inv_id,
          inv_make: itemData.inv_make,
          inv_model: itemData.inv_model,
          inv_price: itemData.inv_price,
          inv_year: itemData.inv_year,
        })
      return
    }
    next()
  }
module.exports = validate