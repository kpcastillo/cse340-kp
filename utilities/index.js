const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log("data in utilities/index.js: ", data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ******************************** 
 * Build the inventory detail view HTML
 * ************************************ */
Util.buildInvItemView = async function(data){
  let itemView
  if (data) {
    itemView = '<div id="item-display">'
    itemView += '<div class="item-image">'
    itemView += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' 
    + data.inv_model + ' on CSE Motors" />'
    itemView += '</div>'
    itemView += '<div class="item-info">'
    //itemView += '<h2>' + data.inv_make + ' ' + data.inv_model + '</h2>'
    itemView += '<p>Price: $' 
    + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    itemView += '<p>Description: ' + data.inv_description + '</p>'
    itemView += '<p>Color: ' + data.inv_color + '</p>'
    itemView += '<p>Miles: ' 
    + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
    itemView += '</div>'
    itemView += '</div>'
  } else {
    itemView += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }

  return itemView
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ************************
  * Build the classification select list
  ************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
  * Build the account management nav
  * ************************************ */
 Util.buildAccountNav = async function(accountType){
  let accNav = '<ul>'
  accNav += '<li><a href="/account/" title="Account Management">Account Management</a></li>'
  if(accountType > 1){
   accNav += '<li><a href="/inv/" title="Inventory Management">Inventory Management</a></li>'
  }
  accNav += '<li><a href="/account/logout" title="Log out">Log out</a></li>'
  accNav += '</ul>'
  return accNav
 }

 /* ****************************************
  * Check account type and authorize if admin
  * ************************************ */
 Util.checkAccountType = async function(req, res, next) {
  try {
    if (res.locals.loggedin && res.locals.accountData) {
      const accountType = res.locals.accountData.account_type
      if (accountType === "Employee" || accountType === "Admin") {
        return next()
      }
    }
    req.flash(
      "notice",
      "You must be logged in as an Employee or Admin to access that page."
    )
    return res.redirect("/account/login")

  } catch (error) {
    next(error)
  }
}

 /* ****************************************
  * Build Reviews Form
  * ************************************ */
 Util.buildReviewsForm = async function(invId){
  let reviewForm = '<form action="/reviews/new" method="post" id="review-form">'
  reviewForm += '<input type="hidden" name="inv_id" value="' + invId + '" />'
  reviewForm += '<label for="review_text">Write your review:</label>'
  reviewForm += '<textarea name="review_text" id="review_text" required></textarea>'
  reviewForm += '<button type="submit">Submit Review</button>'
  reviewForm += '</form>'
  return reviewForm
 }

/* ****************************************
  * Build Reviews Display
  * ************************************ */
 Util.buildReviewsDisplay = async function(data){
  let reviewsDisplay = '<ul id="reviews-display">'
  data.forEach(review => {
    reviewsDisplay += '<li>'
    reviewsDisplay += '<h3>' + review.account_firstname.charAt(0).toUpperCase() 
    + review.account_firstname.slice(1) + ' ' + review.account_lastname.charAt(0).toUpperCase() 
    + review.account_lastname.slice(1).charAt(0) + '.</h3>'
    reviewsDisplay += '<p>' + review.review_text + '</p>'
    reviewsDisplay += '<hr />'
    reviewsDisplay += '</li>'
  })
  reviewsDisplay += '</ul>'
  return reviewsDisplay
 }

module.exports = Util
