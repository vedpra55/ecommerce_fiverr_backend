const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");

async function registerUser(req, res) {
  try {
    const { name, sirName, phoneNumber, email, password } = req.body;

    if (!(name, sirName, phoneNumber, email, password)) {
      return res.status(400).send("All fields must be filled");
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        error: "Email id already exist",
      });
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      name,
      sirName,
      phoneNumber,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false,
      address: {
        zipCode: "",
        city: "",
        state: "",
        landMark: "",
      },
    });

    const access_token = generateAuthToken(user._id, user.email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      sirName: user.sirName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
      token: access_token,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!(email, password)) {
      return res.status(400).send("All inputs are required");
    }

    const user = await User.findOne({ email });

    if (user && comparePassword(password, user.password)) {
      const access_token = generateAuthToken(user._id, user.email);

      return res.json({
        _id: user._id,
        name: user.name,
        sirName: user.sirName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address,
        token: access_token,
      });
    } else {
      return res.status(401).json({
        error: "Wrong Credential",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err.message });
  }
}

async function verifyLoggedinUser(req, res) {
  try {
    const token = req.body.token;

    if (!token) {
      return res.send(null);
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decode._id });

    return res.json({
      _id: user._id,
      name: user.name,
      sirName: user.sirName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      token: token,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function updateUserProfile(req, res, next) {
  try {
    const { name, sirName, phoneNumber, address, token } = req.body;

    if (!token) {
      return res.status(401).json({
        error: "No token",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decode._id }).orFail();

    user.name = name || user.name;
    user.sirName = sirName || user.sirName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address.zipCode = address?.zipCode;
    user.address.state = address?.state;
    user.address.city = address?.city;
    user.address.landMark = address?.landMark;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      sirName: user.sirName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      error: err.message,
    });
  }
}

async function getUserProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id).orFail();

    return res.json({
      _id: user._id,
      name: user.name,
      sirName: user.sirName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getAllUser(req, res) {
  try {
    const uid = req.query.uid;

    const adminUser = await User.findOne({ _id: uid });

    if (!adminUser.isAdmin) {
      return res.json({
        data: "no admin user found",
      });
    }

    const allUsers = await User.find({});
    return res.json({
      data: allUsers,
    });
  } catch (err) {
    res.json({
      data: err.message,
    });
    console.log(err);
  }
}

async function editUserDetailsByAdmin(req, res, next) {
  try {
    const { userId, name, sirName, phoneNumber, address, adminId } = req.body;

    console.log(userId, adminId);

    const adminUser = await User.findOne({ _id: adminId });

    if (!adminUser.isAdmin) {
      return res.json({
        data: "no admin user found",
      });
    }

    const user = await User.findOne({ _id: userId }).orFail();

    user.name = name || user.name;
    user.sirName = sirName || user.sirName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address.zipCode = address?.zipCode;
    user.address.state = address?.state;
    user.address.city = address?.city;
    user.address.landMark = address?.landMark;

    await user.save();

    res.json({
      data: "client updated",
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyLoggedinUser,
  updateUserProfile,
  getUserProfile,
  getAllUser,
  editUserDetailsByAdmin,
};
