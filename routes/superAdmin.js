const express = require("express");
const { body, validationResult } = require("express-validator");
const SuperAdmin = require("../models/SuperAdmin");
const CreateAdmin = require("../models/CreateAdmin");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");

const JWT_SECRET = process.env.SECRET_KEY; 

router.post(
  "/sup-admin",async (req, res) => {
    // if there are error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with this  email exist already

    try {
      
      const salt = await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a user
      superadmin = await SuperAdmin.create({
           password: secPass,
          email: req.body.email,
      });

      res.json({ "message":"success" });

    } 
    
    
    catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

router.post("/create-admin",async(req,res)=>{
         try {
      let createadmin = await CreateAdmin.findOne({ email: req.body.email });
      if (createadmin) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      // create a Employer
      createadmin = await CreateAdmin.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        typeOfAdmin:req.body.typeOfAdmin,
        gender:req.body.gender,

      });

      const data = {
        createadmin: {
          id: createadmin.id,
        },
      };

      const authtoken = jwt.sign(
        data,

        JWT_SECRET,
        {
          expiresIn: "50m",
        }
      );

      const link = `http://localhost:3000/admin/verification
                    /${createadmin._id}/${authtoken}`;
      console.log(link);
      console.log(createadmin.email);
      try {
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,

          to: createadmin.email,
          subject: "InternShala- Admin verification Link",
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
  
})

router.post("/verify-email/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const admin = await CreateAdmin.findById(id);

  try {
    jwt.verify(token, JWT_SECRET);

    await CreateAdmin.updateOne(
      { _id: admin._id },
      { $set: { isVerified: true } }
    );
    res.json({ msg: " Admin Verification Complete" });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Invalid Token ",
    });
  }
});





router.get("/get-admin", async (req, res) => {
  try {
    adminId = req.body.id;
    const admin = await CreateAdmin.findById(adminId).select("-password");
    res.send(admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});



router.put("/update-admin/:id",  async (req, res) => {
  let admin = await CreateAdmin.findById(req.params.id);
  if (!admin) {
    return res.status(404).send("Not Found");
  }
  try {
    const salt = await bcrypt.genSalt(10);

    const secPass = await bcrypt.hash(req.body.password, salt);

    const updateitem = {
      name: req.body.name,
      password: secPass,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      typeOfAdmin: req.body.typeOfAdmin,
      gender: req.body.gender,
    };

    const id = req.params.id;
    await CreateAdmin.updateOne({ _id: id }, { $set: updateitem });
    res.json({ msg: "Details Of Admin Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
  
});


router.put("/update-password/:id", async (req, res) => {
  let admin = await CreateAdmin.findById(req.params.id);
  if (!admin) {
    return res.status(404).send("Not Found");
  }
  try {
    const salt = await bcrypt.genSalt(10);

    const secPass = await bcrypt.hash(req.body.password, salt);

    const updateitem = {
      password: secPass,
    };

    const id = req.params.id;
    await CreateAdmin.updateOne({ _id: id }, { $set: updateitem });
    res.json({ msg: "Password Of Admin Updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});


router.delete("/delete-admin/:id",async (req, res) => {
  await CreateAdmin.deleteOne({ _id: req.params.id });

  res.json({ msg: "Delete Account" });
});








module.exports =router;
