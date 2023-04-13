const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Resume = require("../models/Resume");
const Detail = require("../models/Pdetail");
const Internship = require("../models/Internship");
const CreateAdmin = require("../models/CreateAdmin");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");

const JWT_SECRET = process.env.SECRET_KEY;

router.post("/login", async (req, res) => {
  // use destructuring
  const { email, password } = req.body;

  try {
    let createAdmin = await CreateAdmin.findOne({ email:email,typeOfAdmin:"Student Admin" }); // take object
    if (!createAdmin) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credential" });
    }

     if (createAdmin.isVerified == false) {
       return res
         .status(400)
         .json({ error: "You are not Verified by the email" });
     }

    const passwordCompare = await bcrypt.compare(password, createAdmin.password);
    if (!passwordCompare) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credential" });
    }
    const data = {
      createAdmin: {
        id: createAdmin.id,
      },
    };

    const authtoken = jwt.sign(
      data,

      JWT_SECRET,
      {
        expiresIn: "50m",
      }
    );

    res.json({ authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.get("/get-user", fetchuser, async (req, res) => {
  try {

    const user = await User.find({}).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

router.get("/get-user-data",fetchuser, async (req, res) => {
  try {
    userId = req.body.id;
    const resume = await Resume.findOne({ user: userId });
    res.send(resume);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.get("/get-user-personaldetail",fetchuser, async (req, res) => {
  try {
    userId = req.body.id;
    const detail = await Detail.findOne({ user: userId });
    res.send(detail);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

router.get("/get-user-preferencedetails",fetchuser, async (req, res) => {
  try {
    userId = req.body.id;
    const detail = await Internship.findOne({ user: userId });
    res.send(detail);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});




router.delete("/delete/:id",fetchuser, async (req, res) => {
  await User.remove({ _id: req.params.id });
  await Internship.remove({ user: req.params.id });
  await Detail.remove({ user: req.params.id });
  await Resume.remove({ user: req.params.id });
  res.json({ msg: "Delete Account" });
});

router.post("/block",fetchuser, async (req, res) => {
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
      message: "Internal Error",
    });
  }
});

module.exports =router
