const express = require("express");
const InternshipDetail = require("../models/InternshipDetail");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");


const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: fileFilter,
});

const cpUpload = upload.fields([
  
  { name: "assignment", maxCount: 1 },
]);
router.post("/internship-detail", fetchuser, async (req, res) => {
    // let obj = JSON.parse(req.body.data);
    let obj=req.body.data;
  // let sDate = obj.startDate;
  // let amount = obj.stipened;
  // if (!sDate.immediate && !sDate.later) {
  //   res.json({
  //     message: "Please select the start Date",
  //   });
  // } else 


  // if (!amount.unpaid && !amount.negotiable && !amount.fixed) {
  //   res.json({
  //     message: "Please select one option in stipened",
  //   });
  // }
  //  else {
          //    var p;
          // if(req.files["assignment"])
          // {
          //   p = req.files["assignment"][0].path;   
          // }
          // else{

          // }

    try {

        // console.log(req.files["assignment"][0]);
      detail = await InternshipDetail.create({
        department: obj.department,
        internshipType: obj.internshipType,
        city: obj.city,
        numberOfOpening: obj.numberOfOpening,
        startDate: obj.startDate,
        internshipDuration: obj.internshipDuration,
        jobDescription: obj.jobDescription,
        stipened: obj.stipened,
        perks: obj.perks,
        skills: obj.skills,
        question: obj.question,
        coverLetter: obj.coverLetter,
        availability: obj.availability,
        about: obj.about,
        additionalInformation: obj.additionalInformation,
        // assignment:p ,
        additionalQuestion:obj.additionalQuestion,
        appliedDate:obj.appliedDate,
        employer: req.employer.id,

      });
      res.json({ message: "success" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  
});

module.exports = router;
