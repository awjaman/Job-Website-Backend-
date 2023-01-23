const express = require("express");
const { body, validationResult } = require("express-validator");
const Employer = require("../models/Employer");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");

const JWT_SECRET = "Amanisagoodb$oy";



router.post(
  "/login",
  [
    body("email", "Enter a  valid email").isEmail(),
    body("password", "Password cannot be a blank ").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // use destructuring
    const { email, password } = req.body;

    try {
      let employer = await Employer.findOne({ email }); // take object
      if (!employer) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      }
      if (employer.isVerified == false) {
        return res
          .status(400)
          .json({ error: "You are not Verified by the email" });
      }
      const passwordCompare = await bcrypt.compare(password, employer.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      }
      const data = {
        employer: {
          id: employer.id,
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
  }
);

module.exports =router;