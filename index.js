const connectToMongo = require("./db");
const express = require("express");
connectToMongo();
const app = express();
const port = 4002;

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
// Available routes
app.use("/student/login", require("./routes/login"));
app.use("/student/personaldetail", require("./routes/personaldetail"));
app.use("/student/preference", require("./routes/preference"));
app.use("/student/detail", require("./routes/detail"));
app.use("/student/profile", require("./routes/profile"));
app.use("/student/joblist", require("./routes/joblist"));
app.use("/employer/register", require("./routes/register"));
app.use("/employer/employer-login", require("./routes/employer-login"));
app.use("/employer/employer-profile", require("./routes/employer-profile"));
app.use("/employer/post-internship", require("./routes/post-internship"));
app.use("/employer/dashboard", require("./routes/dashboard"));
app.use("/super-admin", require("./routes/superadmin"));
app.use("/student-admin", require("./routes/studentadmin"));
app.use("/employer-admin", require("./routes/employeradmin"));




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
