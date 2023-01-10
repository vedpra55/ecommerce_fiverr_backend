const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function verifyIsLoggedIn(req, res, next) {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({ _id: decode._id });
      req.user = {
        _id: user._id,
        name: user.name,
        sirName: user.sirName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      next();
    } catch (err) {
      console.log(err.message);
      res.status(401).json({ error: err.message });
    }
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ error: err.message });
  }
}

module.exports = { verifyIsLoggedIn };
