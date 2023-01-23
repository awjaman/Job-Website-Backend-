const jwt = require("jsonwebtoken");
const JWT_SECRET = "Amanisagoodb$oy";

const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and add id to req object

  const token = req.header("auth-token");
  if (!token) {
    res
      .status(401)
      .send({
        error:
          "Please authenticate using a valid token  or Token Expires please Login again with email and Password",
      });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log(data.employer);
    //  console.log(data.data);
    req.user = data.user;
    req.employer = data.employer;
    // console.log(req.user.id);
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token " });
  }
};
module.exports = fetchuser;
