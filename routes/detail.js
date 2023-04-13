const express = require("express");
const { body, validationResult } = require("express-validator");
const Resume = require("../models/Resume");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();


// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(null, false);
    
//   }
// };

// var upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50,
//   },
//   fileFilter: fileFilter,
// });


// const cpUpload = upload.fields([
//   { name: "coverLetter", maxCount: 1 },
 
// ]);


// router.post("/resume", fetchuser,cpUpload, async (req, res) => {
  // if there are error return bad request and the error
  router.post("/resume", fetchuser, async (req, res) => {
  try {

    //  console.log(req.body.data);
    // let obj=JSON.parse(req.body.data);
    // console.log(obj)
    user = await Resume.create({
      education: req.body.education,
      job: req.body.job,
      internship: req.body.internship,
      responsibilties: req.body.responsibilties,
      training: req.body.training,
      // academicProject: obj.academicProject,
      portfolio: req.body.portfolio,
      skills: req.body.skills,
      // coverLetter: req.files['coverLetter'][0].path,
      // yourAvailability: obj.availability,
          additionalDetail:req.body.additionalDetail,
      user: req.user.id,
    });
    res.json({ message: "success" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});


module.exports = router;
