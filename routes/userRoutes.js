const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  verifyLoggedinUser,
  getAllUser,
  editUserDetailsByAdmin,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verifyLogedinUser", verifyLoggedinUser);

// User logged in routes
router.put("/updateProfile", updateUserProfile);
router.get("/profile/:id", getUserProfile);
router.get("/allUsers", getAllUser);
router.put("/adminEditUser", editUserDetailsByAdmin);

module.exports = router;
