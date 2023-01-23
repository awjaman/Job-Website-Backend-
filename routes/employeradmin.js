const express = require("express");
const { body, validationResult } = require("express-validator");

const Employer= require("../models/Employer");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const Detail = require("../models/Pdetail");

const InternshipDetail = require("../models/InternshipDetail");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");


const JWT_SECRET = process.env.SECRET_KEY;


router.get("/get-employer", async (req, res) => {

           const {name}=req.query;
           const queryobject ={}
           if(name)
           {
             queryobject.name ={
               $regex: name,
               $options: "i",
             };
           }
           console.log(queryobject)
  try {
    const employer = await Employer.find(queryobject).select("-password");
    res.send(employer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});
router.get("/job-posted", async (req, res) => {
  try {
      const id =req.body.id
    const internshipdetail = await InternshipDetail.find({employer:id}).select("-password");
    res.send(internshipdetail);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.post("/action/block",async(req,res)=>{
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

router.post("/action/unblock", async (req, res) => {
  try {
    const id = req.body.id;
    
    await InternshipDetail.updateOne({ _id: id }, { $set: { block: false } });
    res.send({ msg: "Intern UnBlocked" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.post("/action/accept-intern", async (req, res) => {
  try {
    const internid = req.body.id;
    await InternshipDetail.updateOne({ _id: internid }, { $set: { accept: true } });
    res.send({"msg":"Intern Accepted "})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

router.get("/view-candidate", async (req, res) => {
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


router.get("/intern-posted", async (req, res) => {
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

router.delete("/delete/:id", async (req, res) => {

  await InternshipDetail.remove({ _id: req.params.id });
 
  res.json({ msg: "Internship Deleted" });
});






module.exports =router;