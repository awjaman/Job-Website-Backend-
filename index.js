const connectToMongo = require("./db");
const express = require("express");
const socket = require("socket.io");
connectToMongo();
const app = express();
const port = 4002;
var cors = require("cors");

var bodyParser = require("body-parser");
app.use(cors());
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
app.use("/chat", require("./routes/chat"));
app.use("/company-detail", require("./routes/about"));

const server=app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});



