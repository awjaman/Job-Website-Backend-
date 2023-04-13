const express = require("express");
const { body, validationResult } = require("express-validator");

const Employer= require("../models/Employer");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const Detail = require("../models/Pdetail");
const  CreateAdmin= require("../models/CreateAdmin");
const InternshipDetail = require("../models/InternshipDetail");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");


const JWT_SECRET = process.env.SECRET_KEY;

router.post("/login", async (req, res) => {
  // use destructuring
  const { email, password } = req.body;
    // console.log(email);
    // console.log(password);

  try {
    let createAdmin = await CreateAdmin.findOne({
      email:email,
      typeOfAdmin:"Employer Admin",
    }); // take object
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

    const passwordCompare = await bcrypt.compare(
      password,
      createAdmin.password
    );
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
router.get("/get-employer",fetchuser, async (req, res) => {

           const {temp}=req.query;
           const queryobject ={}
           
               const regex = new RegExp(temp, "i");
           if(temp)
           {
             queryobject.name ={
               "name.firstName":{
               $regex: regex
               }
         
             };
           }
           console.log(queryobject)
  try {
    const employer = await Employer.find(queryobject.name).select("-password");
    res.send(employer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});
router.get("/job-posted",fetchuser, async (req, res) => {
  try {
      const id =req.body.id
    const internshipdetail = await InternshipDetail.find({employer:id}).select("-password");
    res.send(internshipdetail);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.post("/action/block",fetchuser,async(req,res)=>{
    try {
      const id = req.body.id;
      console.log(id)
      await InternshipDetail.updateOne({ _id: id }, { $set: { block: true } });
        res.send({"msg":"Intern Blocked"})
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
})

router.post("/action/unblock",fetchuser, async (req, res) => {
  try {
    const id = req.body.id;
    
    await InternshipDetail.updateOne({ _id: id }, { $set: { block: false } });
    res.send({ msg: "Intern UnBlocked" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.post("/action/accept-intern",fetchuser, async (req, res) => {
  try {
    const internid = req.body.id;
    await InternshipDetail.updateOne({ _id: internid }, { $set: { accept: true } });
    res.send({"msg":"Intern Accepted "})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

router.get("/view-candidate",fetchuser, async (req, res) => {
  try {
    const id = req.body.job_id;
    const detail = await Job.find({ job: id });

    let user = [];

    for (let i = 0; i < detail.length; i++) {
      let obj = {
        detail: await Resume.findOne({ user: detail[i].user }),
        personaldetail:await Detail.findOne({user:detail[i].user})
      };
      user.push(obj);
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});


router.get("/intern-posted",fetchuser, async (req, res) => {
  try {
    
    const internshipdetail = await InternshipDetail.find({})
     
    const intern=[];
    for (let i = 0; i < internshipdetail.length; i++) {
      let obj = {
        companyname: await Employer.find({ _id: internshipdetail[i].employer },{_id:0,name:1}),
        department: internshipdetail[i].department,
        view:internshipdetail[i]
      };
      intern.push(obj);
    }


    res.send(intern);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

router.delete("/delete/:id",fetchuser,async (req, res) => {

  await InternshipDetail.remove({ _id: req.params.id });
 
  res.json({ msg: "Internship Deleted" });
});






module.exports =router;