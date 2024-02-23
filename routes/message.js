const express = require("express");
const messagerouter = express.Router();
const { addmessage, getmesssage } = require("../controllers/messageController");

messagerouter.post("/addmsg/", addmessage);
messagerouter.post("/getmsg", getmesssage);
module.exports = messagerouter;
