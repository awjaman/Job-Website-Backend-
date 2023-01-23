const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");

const JWT_SECRET = process.env.SECRET_KEY; // Secret Key
//ROUTE:1 create a user using :POST  "/api/auth/createuser". Who first time use

router.post(
  "/register",
  [
    body("email", "Enter a  valid email").isEmail(),
    body("password", "Enter a passward at least 8 character").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // if there are error return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with this  email exist already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(
        data,

        JWT_SECRET,
        {
          expiresIn: "50m",
        }
      );

      const link = `http://localhost:3000/user/user/
                reset/${user._id}/${authtoken}`;
      console.log(link);

      try {
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,

          to: user.email,
          subject: "InternShala- User verification Link",
          html: `<a href =${link}>Click Here</a> for the verification  `,
        });
        console.log(process.env.EMAIL_FROM);
        console.log(user.email);
        res.send({
          status: "success",
          message:
            "For the verification email sent .... Please check your Email",
          info: info,
          Token: `${authtoken}`,
        });
      } catch (error) {
        res.send({
          status: "failed",
          message: "Not send Email ",
        });
      }

      //  res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//  verify Email

router.post("/verify-email/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const user = await User.findById(id);

  try {
    jwt.verify(token, JWT_SECRET);

    await User.updateOne({ _id: user._id }, { $set: { isVerified: true } });
    res.json({ msg: " User Verification Complete" });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Invalid Token ",
    });
  }
});

// ROUTE:2 authenticate  a user using :POST  "/api/auth/login"  .No login required

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
      let user = await User.findOne({ email }); // take object
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      }
      if (user.isVerified == false) {
        return res
          .status(400)
          .json({ error: "You are not Verified by the email" });
      }
      if (user.isBlock == true) {
        return res
          .status(400)
          .json({ error: "You are Blocked by admin , please contact to the admin of website" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credential" });
      }
      const data = {
        user: {
          id: user.id,
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