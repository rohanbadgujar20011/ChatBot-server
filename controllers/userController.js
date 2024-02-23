const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res, next) => {
  try {
    const { Username, Password } = req.body;
    let username = Username;
    let password = Password;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        msg: "Incorrect Credentials Check Again",
        status: false,
      });
    }
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (!isPasswordvalid)
      return res.json({ msg: "Incorrect Password Try again", status: false });

    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    return res.json({ status: true, user: userWithoutPassword });
  } catch (error) {
    console.log(error);
  }
};
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Check if the username is already used
    const usernameCheck = await User.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    // Check if the email is already used
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    return res.json({ status: true, user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    console.log(ex);
  }
};
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvtarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvtarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
