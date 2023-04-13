const express = require("express");
const InternshipDetail = require("../models/InternshipDetail");
const Job = require("../models/Job");
const About= require("../models/About");

const ObjectId = require("mongodb").ObjectId;

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






router.get("/job-list", fetchuser,async (req, res) => {
  try {
         const {department,internshipType,city} =req.query;
         const queryobject={}
          console.log(internshipType)
         if(department)
         {
           queryobject.department ={$regex:department,$options:'i'};
         }
         if (internshipType) {
           queryobject.internshipType = {$regex:internshipType,$options:'i'};
         }
       
       console.log(queryobject);
    //    const joblist = await InternshipDetail.find(
    //   queryobject,
    //   {
    //     department: 1,
    //     internshipType: 1,
    //     startDate: 1,
    //     internshipDuration: 1,
    //     stipened: 1,
    //     appliedDate:1
    //   }
    // );

 var job = InternshipDetail.aggregate([
   {
     $lookup: {
       from: "employers",
       localField: "employer",
       foreignField: "_id",
       as: "company",
     },
   },
   {
     $match:queryobject
    },
  

   { $unwind: "$company" },
 ]);

     job.exec(async (err, result) => {
     if (result) {
     res.send(result);
      }
     if (err) {
     console.log("error", err);
     }
    }); 



    // res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});

router.get("/select-job", fetchuser, async (req, res) => {
  try {
    const id = req.body.id;
    
    // const viewdetail = await InternshipDetail.find({ _id: id }, {});

    // res.json(viewdetail);
    
       var applicant = InternshipDetail.aggregate([
         {
           $lookup: {
             from: "abouts",
             localField: "employer",
             foreignField: "employer",
             as: "jobdetail",
           },
         },
         {
           $match: {
             _id: ObjectId(id),
           },
         },
        // {
        //    $match: {
        //      skills: {
        //        $in:["aaa"]
        //      }
        //    },
        //  },
        

         { $unwind: "$jobdetail" },
       ]);

        
       applicant.exec(async (err, result) => {
         if (result) {
           res.send(result);
         }
         if (err) {
           console.log("error", err);
         }
       }); 


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});

router.post("/apply", fetchuser, cpUpload,async (req, res) => {
  try {
       var st ="Applied"
    // let obj = JSON.parse(req.body.data);
    detail = await Job.create({
      job: req.body.job_id,
      user: req.user.id,
      assignment: req.files["assignment"][0].path,
      status: st
    });
    res.json({ message: "success" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});



module.exports = router;
