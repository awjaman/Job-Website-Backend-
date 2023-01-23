const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Internship = require("../models/Internship");
const Detail = require("../models/Pdetail");
const Resume = require("../models/Resume");
const Job = require("../models/Job");
const InternshipDetail= require("../models/InternshipDetail");
const Employer = require("../models/Employer");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../emailConfig");


const JWT_SECRET = process.env.SECRET_KEY; 




router.get("/get-user-data", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


router.get("/my-application", fetchuser, async (req, res) => {
  try {
    const detail = await Job.find({ user: req.user.id });
    let user = [];
    
    
    
    for (let i = 0; i < detail.length; i++) {
      let obj={
      detail : await InternshipDetail.findOne({ _id: detail[i].job }),
      date : detail[i].date,

      }
      console.log(obj.detail.employer);
      let company = {
        companyName: await Employer.findOne({ _id: obj.detail.employer },{name:1}),
        NumberOfCandidate:await Job.count({job:obj.detail._id})
      };
      
      user.push(obj);
      user.push(company);
    }
        res.json(user);
  } 
   
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error ");
  }
});


 
router.get("/view-application", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const resume = await Resume.findOne({user:userId})
    res.send(resume);
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});


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
  { name: "coverLetter", maxCount: 1 },
  
]);




router.put("/update-resume/:id", fetchuser,cpUpload, async (req, res) => {
  let resume = await Resume.findById(req.params.id);
  if (!resume) {
    return res.status(404).send("Not Found");
  }
  console.log(resume.user);
  if (resume.user.toString() !== req.user.id) {
    return res.status(401).send("Not Found");
  }

  let obj = JSON.parse(req.body.data);
  const updateitem = {
       education: obj.education,
      job: obj.job,
      academicProject: obj.academicProject,
      portfolio: obj.portfolio,
      skills: obj.skills,
      coverLetter: req.files['coverLetter'][0].path,
      yourAvailability: obj.availability,
    
     
  };

  const id = req.params.id;
  await Resume.updateOne({ _id: id }, { $set: updateitem });
  res.json({ msg: "updated Resume" });
});

router.put("/manage-account/update-detail/:id", fetchuser, async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  const secPass = await bcrypt.hash(req.body.password, salt);
  const updateitem = {
    email: req.body.email,
    password: secPass,
  };
  const id = req.params.id;
  await User.updateOne({ _id: id }, { $set: updateitem });
  res.json({ msg: "updated Password" });
});

// router for reset  the password

router.post("/manage-account/reset-password", async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ email: email });
    if (user) {
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(
        {
          data: data,
        },
        JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

      const link = `http://localhost:3000/user/user/
                reset/${user._id}/${authtoken}`;
      console.log(link);
      // send Email
      try {
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,

          to: user.email,
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
  const user = await User.findById(id);
  
  try {
    jwt.verify(token, JWT_SECRET);
    if (password) {
      const salt = await bcrypt.genSalt(10);

      const secPass = await bcrypt.hash(req.body.password, salt);
      await User.updateOne({ _id: user._id }, { $set: { password: secPass } });
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

// Router-4  To Delete a Account    --------Login Required

router.delete("/manage-account/delete/:id", fetchuser, async (req, res) => {
  await User.remove({ _id: req.params.id });
  await Internship.remove({ user: req.params.id });
  await Detail.remove({ user: req.params.id });
  await Resume.remove({ user: req.params.id });
  res.json({ msg: "Delete Account" });
});

module.exports = router;
