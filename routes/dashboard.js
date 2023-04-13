const express = require("express");
const InternshipDetail = require("../models/InternshipDetail");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const Detail = require("../models/Pdetail");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;
router.get("/profile", fetchuser, async (req, res) => {
  try {
    const profile = await InternshipDetail.find({ employer: req.employer.id });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});

// router.get("/view-candidate", fetchuser, async (req, res) => {
//   try {
//     const id = req.body.job_id;
//     const detail = await Job.find({ job: id });
//     let user = [];

//     for (let i = 0; i < detail.length; i++) {
//       let obj={
//        detail: await Resume.findOne({ user: detail[i].user }),
//        assignment:detail[i].assignment
      
//       }
//       user.push(obj);
//     }

//     res.json(user);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error ");
//   }
// });

router.get("/view-candidate", fetchuser, async (req, res) => {
  try {
    const id = req.body.job_id;
    var job = Job.aggregate([
      {
        $lookup: {
          from: "resumes",
          localField: "user",
          foreignField: "user",
          as: "applicant",
        },
      },
      {
        $match: {
          job: ObjectId(id),
        },
      },
      // {
      //    $match: {
      //      skills: {
      //        $in:["aaa"]
      //      }
      //    },
      //  },

      { $unwind: "$applicant" },
    ]);

    job.exec(async (err, result) => {
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



router.post("/shortlist",fetchuser, async (req, res) => {
  const id = req.body.id;
  const jobid=req.body.jobid;
  const job = await Job.findOne({ user: id, job: jobid });

  try {
    await Job.updateOne({ _id: job._id }, { $set: { status: "Shortlist" } });
    res.json({ msg: " User Shortlisted" });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Error Occured",
    });
  }
});

router.post("/reject", fetchuser, async (req, res) => {
  const id = req.body.id;
  const jobid = req.body.jobid;
  const job = await Job.findOne({ user: id, job: jobid });

  try {
    await Job.updateOne({ _id: job._id }, { $set: { status: "Rejected" } });
    res.json({ msg: " User Rejected" });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Error Occured",
    });
  }
});

router.post("/hire", fetchuser, async (req, res) => {
  const id = req.body.id;
  const jobid = req.body.jobid;
  const job = await Job.findOne({ user: id, job: jobid });

  try {
    await Job.updateOne({ _id: job._id }, { $set: { status: "Hire" } });
    res.json({ msg: " You are selected" });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Error Occured",
    });
  }
});




router.get("/filter-student", fetchuser, async (req, res) => {
  try {
     const { skills, city } = req.query;
        //  const queryobject = {};

            
          // {
        //    $match: {
        //      skills: {
        //        $in:["aaa"]
        //      }
        //    },
        //  },



//          if (skills) {
//                  const regex = new RegExp(skills, "i");
// //         //  queryobject.skills ={$all:[{ $regex: skills, $options: "i" }]};
//          queryobject.skills ={ 
//                  $regex: regex, $options: "i" };
//        }
       
//        if (city) {
//          const regex = new RegExp(city, "i");
//          queryobject.address = {
//            $or: [
//              { "detail.address.cLocation": { $regex: regex } },
//              { "detail.address.sLocation": { $regex: regex } },
//            ],
//          };
//        }
    //  console.log(queryobject);
  
   var applicant = Job.aggregate([
     {
       $lookup: {
         from: "resumes",
         localField: "user",
         foreignField: "user",
         as: "anything",
       },
     },
    //  { $match: { "anything.isVerified": true } },

     { $unwind: "$anything" },

     {
       $lookup: {
         from: "pdetails",
         localField: "user",
         foreignField: "user",
         as: "detail",
       },
     },
     { $unwind: "$detail" },
     //  {
     //    $match:queryobject.address
     //  },
     {
        $match: {
          "anything.skills": {
            $in:[skills]
          }
        },
      },
   ]);
            applicant.exec(async(err, result) => {
              
          if (result) {
                res.send(result)
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
  
        





  



router.get("/view-internship", fetchuser, async (req, res) => {
  try {
    const viewinternship = await InternshipDetail.find({ _id: req.body.id });

    res.json(viewinternship);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});


router.delete("/delete/:id", fetchuser, async (req, res) => {
 
  await InternshipDetail.remove({ _id: req.params.id });
 
  res.json({ msg: "Internship Deleted" });
});


module.exports = router;
