const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}
/****************
 * *bImplement an intentional error
 * **************/

baseController.errorForAssignment = async function(req, res, next){
  throw new Error("Error for task 3 week 3.")
}

module.exports = baseController