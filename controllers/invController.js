const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
  })
}
module.exports = invCont

