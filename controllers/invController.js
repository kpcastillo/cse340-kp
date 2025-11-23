const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const reqValidate = require("../utilities/inventory-validation")
const accountModel = require("../models/account-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByItemId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByItemId(inv_id)
  const itemView = await utilities.buildInvItemView(data)
  let nav = await utilities.getNav()
  res.render("./inventory/items", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    itemView,
    errors: null
  })
}
/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ***************************
  * Process add classification
  * ************************** */
invCont.addClassification = async function (req, res) {
  
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(
    classification_name
  )
  
  if (regResult) {

    let nav = await utilities.getNav()

    req.flash(
      "notice",
      `Congratulations, you added a new classification ${classification_name}.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", 'Sorry, there was an error adding the classification.')
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}
module.exports = invCont

