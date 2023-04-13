const mongoose = require("mongoose");
const { Schema } = mongoose;
const InternshipDetailSchema = new Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer",
  },
  department: {
    type: String,
  
  },

  internshipType: {
    type: String,
    
  },
  city: {
    type: String,
    
  },
  numberOfOpening: {
    type: Number,
  
  },
  startDate: {
    type:String,
    
    // immediate: {
    //   type: String,
    // },
    // later: {
    //   from: {
    //     type: Date,
    //   },
    //   to: {
    //     type: Date,
    //     validate: [dateValidator, "Start Date must be less than End Date"],
    //   },
    // },
  },

  internshipDuration: {
    number:{
      type:Number,
      
    },
    type:{
      type:String,
     
    }
    
  },
  jobDescription: {
    type: String,
    
  },
  stipened: {
    unpaid: {
      type: String,
    },
    fixed: {
      amount:{
          type:Number  
            },
      type:{
       type:String
      }
      
    },
    negotiable: {
      amount:{
      from: {
        type: Number,
      },
      to: {
        type: Number,
      },
    },
    type:{
      type:String
    }
    },
  },
  perks: {
    type: Array,
    
    items: {
      type: String,
    },
  },
  skills: {
    type: Array,
    
    items: {
      type: String,
    },
  },
  question: {
    type: Array,
    item: {
      type: String,
    },
  },
  coverLetter: {
    type: String,
  },
  availability: {
    type: Array,
       items: {
      type: String,
    },
  },
  assignment:{
    type:String
  },
  accept:{
    type:Boolean,
    default:false
  },
  block:{
     type:Boolean,
     default:false
  },

  
  additionalInformation:{
    type:String,
    
  },
  additionalQuestion:{
    type:String
  },
  appliedDate:{
    type:String
  }



});

// function dateValidator(value) {
//   return this.startDate.later.from <= value;
// }

// creating model

const InternshipDetail = mongoose.model(
  "internshipdetail",
  InternshipDetailSchema
);
// User.createIndexes();
module.exports = InternshipDetail;
