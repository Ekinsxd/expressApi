var express = require("express");
var router = express.Router();
var pbkdf2 = require("pbkdf2");

var usersRouter = require("./users.js");

/* GET page after logged in. */
router.get("/", function (req, res, next) {
  if (req.user.admin){
    res.render("adminHome", { title: `You are logged in as ${req.user.email}` });
  }
  res.render("home", { title: `You are logged in as ${req.user.email}` });
});

/* GET page after clicking change password. */
router.get("/changePW", function (req, res, next) {
  res.render("changePW", { title: `Change Password Form` });
});

/* GET page after clicking change password. */
router.get("/delete", function (req, res, next) {
  res.render("deleteUser", {
    title: `Are you sure you want to delete ${req.user.email}'s account?'`,
  });
});

/**
 * Delete Current User's Account.
 */
router.get("/delete/confirm", async function (req, res, next) {
  var id = req.user._id;
  console.log(id);
  var found = await usersRouter.User.findOne({ _id: id });
  console.log(found);
  if (found) {
    found.remove();
    console.log("Account deleted.");
    res.redirect("/");
  } else {
    console.log("error, user not found.");
  }
});

/**
 * POST password change request
 */
router.post("/changePW", async function (req, res, next) {
  var email = String(req.user.email);
  var pw = String(req.body.password);
  pw = pbkdf2.pbkdf2Sync(pw, req.user.salt, 1, 32, "sha512").toString("hex");
  var npw = String(req.body.new_password);
  var npw2 = String(req.body.new_confirm_password);
  var found = await usersRouter.User.findOne({ email: email, password: pw });
  if (found && npw == npw2) {
    password = String(
      pbkdf2.pbkdf2Sync(npw, req.user.salt, 1, 32, "sha512").toString("hex")
    );
    let query = { $set: { password: npw } };
    await found.updateOne({ email: email, password: password }, query).exec();
    found.save();
    console.log("Success!");
    res.redirect("../");
  } else {
    console.log(
      "Current Password is incorrect, or new passwords do not match."
    );
  }
});

/**
 * POST password change request
 */
router.post("/changePW", async function (req, res, next) {
  console.log(req.body);
  console.log(req.user);
  var email = String(req.user.email);
  var pw = String(req.body.password);
  pw = pbkdf2.pbkdf2Sync(pw, req.user.salt, 1, 32, "sha512").toString("hex");
  var npw = String(req.body.new_password);
  var npw2 = String(req.body.new_confirm_password);
  var found = await usersRouter.User.findOne({ email: email, password: pw });
  console.log(npw == npw2);
  console.log(npw);
  console.log(npw2);
  if (found && npw == npw2) {
    password = String(
      pbkdf2.pbkdf2Sync(npw, req.user.salt, 1, 32, "sha512").toString("hex")
    );
    console.log(password);
    let query = { $set: { password: npw } };
    await found.updateOne({ email: email, password: password }, query).exec();
    found.save();
    console.log("Success!");
    res.redirect("../");
  } else {
    console.log(
      "Current Password is incorrect, or new passwords do not match."
    );
  }
});

module.exports = { router };
