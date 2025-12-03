const utilities = require("../utilities/index.js")
const accountModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { parse } = require("dotenv")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password,)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/****************************************
 *  Build Account Management View
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    account_id: accountData.account_id
  })
}

/* ****************************************
 *  Log user out
 * *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login/")
}

/* ****************************************
 *  Build Update Account Information View
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  
  const accountData = await accountModel.getAccountById(account_id)
  const accountName= `${accountData.account_firstname} ${accountData.account_lastname}`
  res.render("account/update-account", {
    title: "Update Account" + accountName,
    nav,
    errors: null,
    accountData,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id
  })
}


/* ****************************************
 *  Process Update Account Information
 * *************************************** */
async function updateAccountInfo(req, res, next) {

  const { account_firstname, account_lastname, account_email, account_id } = req.body
   console.log("updateAccountInfo body:", {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  })
  const updateResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, your account has been updated ${account_firstname}.`
    )
    return res.redirect("/account/")
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/* ****************************************
 *  Build Password Update View
 * *************************************** */
async function buildPasswordUpdate(req, res, next) {
  
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  
  const accountData = await accountModel.getAccountById(account_id)
  const accountName= `${accountData.account_firstname} ${accountData.account_lastname}`
  res.render("account/update-password", {
    title: "Update Password " + accountName,
    nav,
    errors: null,
    accountData,
    account_id: accountData.account_id
  })
}

/* ****************************************
 *  Process Password Update
 * *************************************** */
async function updatePassword(req, res, next) {

  const { account_password, account_id } = req.body
   console.log("updatePassword body:", {
    account_password,
    account_id,
  })
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    res.status(500).render("account/update-password", {
      title: "Update Password",
      nav,
      errors: null,
      account_id
    })
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id,
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, your password has been updated. Please log in again.`
    )
    res.clearCookie("jwt")
    return res.redirect("/account/login/")
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update-password", {
      title: "Update Password",
      nav,
      errors: null,
      account_id
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, accountLogout, buildUpdateAccount, updateAccountInfo, buildPasswordUpdate, updatePassword }