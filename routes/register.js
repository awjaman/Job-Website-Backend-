const express = require("express");
const { body, validationResult } = require("express-validator");
const Employer = require("../models/Employer");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");

const JWT_SECRET = "Amanisagoodb$oy"; // Secret Key
//ROUTE:1 create a user using :POST  "/api/auth/createuser". Who first time use

router.post(
  "/create-employer",
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
      let employer = await Employer.findOne({ email: req.body.email });
      if (employer) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a Employer
      employer = await Employer.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
      });

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

      const link = `http://localhost:3000/employer/verification
                    /${employer._id}/${authtoken}`;
      console.log(link);
      console.log(employer.email);
      try {
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,

          to: employer.email,
          subject: "InternShala- Employer verification Link",
          html: `<a href =${link}>Click Here</a> for the verification  `,
        });

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
  const employer = await Employer.findById(id);

  try {
    jwt.verify(token, JWT_SECRET);

    await Employer.updateOne(
      { _id: employer._id },
      { $set: { isVerified: true } }
    );
    res.json({ msg: " Employer Verification Complete" });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Invalid Token ",
    });
  }
});



module.exports = router;
