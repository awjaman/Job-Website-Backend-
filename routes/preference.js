const express = require("express");
const { body, validationResult } = require("express-validator");
const Internship = require("../models/Internship");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

router.post("/internship",fetchuser,async (req, res) => {
     
          try {
      user = await Internship.create({
        interest: req.body.interest,
        typeOfInternship: req.body.typeOfInternship,
        user: req.user.id,
      });

      res.json({ message: "success" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

module.exports = router;
