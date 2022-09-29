const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    //No hay jwttoken
    if (!jwtToken) {
      return res.status(403).json("No tiene autorización");
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);
    console.log(payload);

    req.user = payload.user;
  } catch (error) {
    return res.status(403).json("No tiene autorización");
  }
  next();
};
