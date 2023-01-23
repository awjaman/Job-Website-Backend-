const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoURI =
  "mongodb://localhost:27017/Internshala?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectionParms={
      useNewUrlParser:true,
      useUnifiedTopology:true,
      // useCreateIndex:true,
      // useFindAndModify:false
};
//  const mongoURI =
//    "mongodb+srv://aman5020:Aman123@cluster0.iqjilyr.mongodb.net/?retryWrites=true&w=majority";
// const connectToMongo = async() => {
//   await mongoose.connect(mongoURI,connectionParms, () => {
//     console.log("connected to mongo Succesfully");
//   });
// };


const connectToMongo=async function findOne() {

    const client = await mongoose.connect(mongoURI, connectionParms,()=>{
           console.log("connected to mongo Succesfully");
    })
        // .catch(err => { console.log(err); });
}



module.exports = connectToMongo;

