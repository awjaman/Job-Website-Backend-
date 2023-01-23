const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Resume = require("../models/Resume");
const Detail = require("../models/Pdetail");
const Internship = require("../models/Internship");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");

const JWT_SECRET = process.env.SECRET_KEY;

router.get("/get-user",  async (req, res) => {
  try {

    const user = await User.find({}).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

router.get("/get-user-data", async (req, res) => {
  try {
    userId = req.body.id;
    const resume = await Resume.findOne({ user: userId });
    res.send(resume);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.get("/get-user-personaldetail", async (req, res) => {
  try {
    userId = req.body.id;
    const detail = await Detail.findOne({ user: userId });
    res.send(detail);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});



router.delete("/delete/:id", async (req, res) => {
  await User.remove({ _id: req.params.id });
  await Internship.remove({ user: req.params.id });
  await Detail.remove({ user: req.params.id });
  await Resume.remove({ user: req.params.id });
  res.json({ msg: "Delete Account" });
});

router.post("/block", async (req, res) => {
    const id =req.body.id;
  const user = await User.findById(id);

  try {
      
    await User.updateOne(
      { _id: user._id },
      { $set: { isBlock: true } }
    );
    res.json({ msg: " User Blocked" });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Invalid Token ",
    });
  }
});

module.exports =router
