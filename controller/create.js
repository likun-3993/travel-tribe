const User = require("../model/user");
const { err } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const Treks = require("../model/treks");
const Trips = require("../model/trips");

const createUser = async (req, res) => {
  const { name, email, password, phonenumber } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return err(res, "email already exists", (stats = 400));
  }
  const newUser = new User({
    name,
    email,
    password,
    phonenumber,
  });
  await newUser.save();
  res.send(newUser);
};

const signin = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return err(res, "email or password can not be empty", (stats = 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return err(res, "no such user", (stats = 400));
  }
  const matched = await user.comparePassword(password);
  if (!matched) return err(res, "incorrect password");

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({
    success: true,
    user: { name: user.name, email: user.email, id: user._id, token },
  });
};

const createPostTrek = async (req, res) => {
  const { title, description, level, seats, vacancy, cost, date } = req.body;
  const data = new Treks({
    title,
    description,
    level,
    seats,
    vacancy,
    cost,
    date,
  });
  await data.save();
  res.json({
    success: true,
    data,
  });
};

const createPostTrip = async (req, res) => {
  const { title, description, level, seats, vacancy, cost, date } = req.body;
  const data = new Trips({
    title,
    description,
    level,
    seats,
    vacancy,
    cost,
    date,
  });
  await data.save();
  res.json({
    success: true,
    data,
  });
};

const showPosts = async (req, res) => {
  const data = await Treks.find();
  res.json(data);
};

module.exports = {
  createUser,
  signin,
  createPostTrek,
  createPostTrip,
  showPosts,
};
