const express = require("express");
const userrouter = express.Router();
const {
  register,
  login,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController");
userrouter.post("/register", register);
userrouter.post("/login", login);
userrouter.get("/allusers/:id", getAllUsers);
userrouter.post("/setavatar/:id", setAvatar);
userrouter.get("/logout/:id", logOut);

module.exports = userrouter;
