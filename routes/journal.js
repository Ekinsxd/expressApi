/**
 * JournalAPI
 *
 * An API for storing journal entries along with
 * location data, mood data, and weather data.
 *
 * This file handles all the user information routes,
 * and should enable our users to create (if they are
 * an admin), update, get, and delete user data.
 *
 * CIS 371 - Fall 2021
 *
 */

/**********
 * Load all the libraries we need.
 **********/
var express = require("express");
var Strategy = require("passport-http").BasicStrategy;
var router = express.Router();
let re =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

/**
 * Pull in the mongoose library and create a schema
 * to base our user model off.
 */
const mongoose = require("mongoose");

// User schema
const { Schema } = mongoose;

const JournalSchema = new Schema({
  owner: {
    type: String
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  locationLong: {
    type: Number
  },
  locationLat: {
    type: Number
  },
  private: {
    type: Boolean,
    default: false
  },
  emotion: String
});

// User model
const JournalBook = mongoose.model("Journal", JournalSchema);

router.get("/", async function (req, res, next) {
  res.render("journal", { title: "Journals!" });
});

router.get("/view", async function (req, res, next) {
  res.render("viewJournals", { title: "Journals!" });
});

router.get("/add", async function (req, res, next) {
  res.render("addJournal", { title: "Add an Entry!" });
});

/**
 * returns all journals from the user.
 */
 router.get("/view", checkAuth, async function (req, res, next) {
  if (req.user.admin || req.user._id == req.params.userId) {
    var user = await User.findOne({ _id: req.params.userId });
    res.json(user);
  } else {
    var error = new Error("Not authorized.");
    error.status = 401;
    throw error;
  }
});

module.exports = { checkAuth, router, User };
