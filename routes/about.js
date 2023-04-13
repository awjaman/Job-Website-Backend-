const express = require("express");
const About = require("../models/About");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");



router.put("/about", fetchuser, async (req, res) => {
  
    try {
           const st = await About.findOne({ employer: req.employer.id });
             
           if(st)
           {
            const updateitem = {
              about: req.body.about,
              websiteLink: req.body.websiteLink,
              employer:req.employer.id
            };
           await About.updateOne({ employer: req.employer.id }, { $set: updateitem });
           res.json({ msg: "updated About" });

           }
           else{
             about = await About.create({
             about: req.body.about,
             websiteLink: req.body.websiteLink,
             employer: req.employer.id,
           });
           res.json({ message: "success" });
          }
       
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

router.get("/about", fetchuser, async (req, res) => {
 try {
   id = req.body.id;
   const about = await About.findOne({ employer: req.employer.id });
      // const about = await About.findOne({ _id: id });
  //  console.log(about);
   res.send(about);
 } catch (error) {
   console.error(error.message);
   res.status(500).send("Internal Server error");
 }
});

module.exports =router 
      