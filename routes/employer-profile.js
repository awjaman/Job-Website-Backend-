const express = require("express");
const { body, validationResult } = require("express-validator");
const Employer = require("../models/Employer");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");

const JWT_SECRET = "Amanisagoodb$oy";


router.get("/get-employer-data",fetchuser,async(req,res)=>{
       
      try {
         employerId=req.employer.id;
         const employer =await Employer.findById(employerId).select("-password");
          res.send(employer);

     } catch (error) {
       console.error(error.message);
       res.status(500).send("Internal Server error");
     }
    
});





router.put("/manage-account/update-personal-detail/:id", fetchuser, async (req, res) => {
  const updateitem = {
    email: req.body.email,
    mobileno: req.body.mobileNo,
    name: req.body.name,
  };
  const id = req.params.id;
  await Employer.updateOne({ _id: id }, { $set: updateitem });
  res.json({ msg: "Details Updated" });
});

// change Password

router.put("/manage-account/change-password/:id", fetchuser, async (req, res) => {
  try {
    let employer = await Employer.findOne({ _id: req.params.id });

    const passwordCompare = await bcrypt.compare(
      req.body.oldpassword,
      employer.password
    );
    const Compare = await bcrypt.compare(req.body.password, employer.password);

    if (!passwordCompare) {
      res.status(400).send({ msg: "Your entered Wrong Old Password" });
    } else if (req.body.password !== req.body.retypepass) {
      res.send({
        msg: "Your password and verify password doesn't match",
      });
    } else if (Compare) {
      res.status(400).send({ msg: "You entered same password as old " });
    } else {
      const salt = await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      const updateitem = {
        password: secPass,
      };
      const id = req.params.id;

      await Employer.updateOne({ _id: id }, { $set: updateitem });
      res.json({ msg: "Password Updated" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

// Delete Account

router.delete("/manage-account/delete/:id", fetchuser, async (req, res) => {
  await Employer.remove({ _id: req.params.id });
  res.json({ msg: "Delete Account" });
});

// Reset PassWord

router.post("/manage-account/reset-password", async (req, res) => {
  const { email } = req.body;
  if (email) {
    const employer = await Employer.findOne({ email: email });
    if (employer) {
      const data = {
        employer: {
          id: employer.id,
        },
      };

      const authtoken = jwt.sign(
        data,

        JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

      const link = `http://localhost:3000/employer/
                reset/${employer._id}/${authtoken}`;
      console.log(link);
      // send Email
      try {
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,

          to: employer.email,
          subject: "InternShala-Password Reset Link",
          html: `<a href =${link}>Click Here</a> to Reset your Password`,
        });

        res.send({
          status: "success",
          message: "Password Reset Email sent.... Please check your Email",
          info: info,
        });
      } catch (error) {
        res.send({
          status: "failed",
          message: "Not send Email ",
        });
      }
    } else {
      res.send({
        status: "failed",
        message: "Email doesn't exist ",
      });
    }
  } else {
    res.send({
      status: "failed",
      message: "Email field is required ",
    });
  }
});

router.post("/manage-account/reset-password/:id/:token", async (req, res) => {
  const { password } = req.body;
  const { id, token } = req.params;
  const employer = await Employer.findById(id);

  try {
    jwt.verify(token, JWT_SECRET);
    if (password) {
      const salt = await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      await Employer.updateOne(
        { _id: employer._id },
        { $set: { password: secPass } }
      );
      res.json({ msg: "updated Password" });
    } else {
      res.send({
        status: "failed",
        message: "Password field are required",
      });
    }
  } catch (error) {
    res.send({
      status: "failed",
      message: "Invalid Token ",
    });
  }
});

module.exports = router;
