const express = require("express");
const Message = require("../models/messageModel");

module.exports.getmesssage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    // Retrieve messages where 'from' is the sender and 'to' is the receiver
    const fromMessages = await Message.find({
      users: {
        $all: [{ from, to }],
      },
    }).sort({ updatedAt: 1 });

    // Retrieve messages where 'to' is the sender and 'from' is the receiver
    const toMessages = await Message.find({
      users: {
        $all: [{ from: to, to: from }],
      },
    }).sort({ updatedAt: 1 });

    // Combine the two arrays into a single array
    const allMessages = [...fromMessages, ...toMessages];

    // Sort the combined array based on 'updatedAt' field
    allMessages.sort((a, b) => a.updatedAt - b.updatedAt);

   
    const formattedMessages = allMessages.map((msg) => ({
      fromself: msg.sender.toString() === from,
      message: msg.message.text,
    }));

    res.json(formattedMessages); // Send the formatted messages in the response
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addmessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: { from, to },
      sender: from,
    });
    if (data) res.json({ msg: "Message Added Sucessfully" });
    else return res.json({ msg: "Failed to add message to database" });
  } catch (error) {
    console.log(error);
  }
};
