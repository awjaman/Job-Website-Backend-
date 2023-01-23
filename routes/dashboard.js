const express = require("express");
const InternshipDetail = require("../models/InternshipDetail");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const Detail = require("../models/Pdetail");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");

router.get("/profile", fetchuser, async (req, res) => {
  try {
    const profile = await InternshipDetail.find({ employer: req.employer.id });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});

router.get("/view-candidate", fetchuser, async (req, res) => {
  try {
    const id = req.body.job_id;
    const detail = await Job.find({ job: id });
    let user = [];

    for (let i = 0; i < detail.length; i++) {
      let obj={
       detail: await Resume.findOne({ user: detail[i].user }),
       assignment:detail[i].assignment
      
      }
      user.push(obj);
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});


router.get("/filter-student", fetchuser, async (req, res) => {
  try {
     const { skills, city } = req.query;
         const queryobject = {};
         if (skills) {
//         //  queryobject.skills ={$all:[{ $regex: skills, $options: "i" }]};
         queryobject.skills ={ $regex: skills, $options: "i" };
       }
       
       if (city) {
         queryobject.address= {
           $regex: city,
           $options: "i",
         };
       }

    var documents=[];
    Job.aggregate([
     
       {
         $lookup: {
           from: "users",
           localField:"user",
           foreignField:"_id",
           as: "anything",
         },
       },

       { $unwind: "$anything" },

       {
         $lookup: {
           from: "resumes",
            localField: "user",
            foreignField: "user",
             as: "detail",
         },
       },
       {$unwind:"$detail"}
     ])
    .exec(async(err, result) => {
       if (err) {
         console.log("error", err);
       }
       if (result) {
         try{
         var res=await result.find({"skills":"Java"})
      console.log(res)
       }
      
      catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
}

     }); 
      
console.log(documents)

res.send({"message":"success"})

  
  
        




//        const id = req.body.job_id;
//        const{skills,city}=req.query
//        const detail = await Job.find({ job: id });
//        const queryobject = {};
//       const queryobject2={}
//        if (skills) {
//         //  queryobject.skills ={$all:[{ $regex: skills, $options: "i" }]};
//          queryobject.skills ={ $regex: skills, $options: "i" };
//        }
       
//        if (city) {
//          queryobject2.cLocation= {
//            $regex: city,
//            $options: "i",
//          };
//        }
//       //  console.log(queryobject)
//         //  console.log(queryobject2);
    
    
//        let user = [];
//        for (let i = 0; i < detail.length; i++) {
//                queryobject.user=detail[i].user;
//                let obj={
//              detail: await Resume.findOne(queryobject ),
//                }
//                if(obj.detail)
//                {
//                queryobject2.user=obj.detail.user;
//                }
//                 console.log(queryobject2);
//               let obj2={
                 
//                  city:await Detail.findOne(queryobject2 )
//                }
//                if(obj.detail!=null && obj2.city!=null){
//                user.push(obj);
//                user.push(obj2);
//                }
//            }
//            console.log(user)
//       //  const data =user.filter((obj1,obj2)=>{
//       //        return obj1.detail!=null&& obj2.city!=null;
//       //  })
//        res.json(user);
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

module.exports = router;
