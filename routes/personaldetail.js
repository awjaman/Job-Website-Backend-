const express = require("express");

const Detail = require("../models/Pdetail");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

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

const fileFilter =(req,file,cb)=>{
      if(file.mimetype==='image/png'||file.mimetype==='image/jpg' || file.mimetype==='image/jpeg')
      {
        cb(null,true);
      }
      else{
        cb(null,false);
        // res.send({"message":"file should should be in jpeg , jpg ,png"});
      }
}

var upload = multer({ 
  storage:storage,
  limits:{
    fileSize:1024*1024*50
  },
  fileFilter:fileFilter
});





router.post("/user", fetchuser,upload.single('profilePic'), async (req, res) => {
  try {
    console.log(req.file);
       let obj =JSON.parse(req.body.data);
       var temp;
       if(req.file)
       {
            temp=req.file.path;
       }
      //  console.log(obj);
       user = await Detail.create({
      name: obj.name,
      gender: obj.gender,
      phoneNumber: obj.phoneNumber,
      address: obj.address,
      user: req.user.id,
      profilePic:temp
    });
    res.json({ message: "success" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

module.exports = router;
