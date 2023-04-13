const express = require("express");
const Chat = require("../models/Chat");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");


router.post("/add-message",fetchuser, async (req, res) => {
           try {
              var from ="";
               if(req.user){
              from = req.user.id;
               }
               if (req.employer) {
                  from = req.employer.id;
               }
             const { to, message } = req.body;
             const data = await Chat.create({
               message: { text: message },
               users: [from, to],
               sender: from,
             });

             if (data) 
             return res.json({ msg: "Message added successfully." });
             else
               return res.json({
                 msg: "Failed to add message to the database",
               });
           } 
           catch (error) {
             console.error(error.message);
             res.status(500).send("Internal Server error");
           }



});

router.get("/get-message",fetchuser, async (req, res) => {
        
    try {

         var from = "";
         if (req.user) {
           from = req.user.id;
         }
         if (req.employer) {
           from = req.employer.id;
         }
      const to  = req.body.to;

      const messages = await Chat.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });

      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
      res.json(projectedMessages);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }

});


module.exports =router;

