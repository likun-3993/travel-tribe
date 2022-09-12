const User = require("../model/user");
const { err } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const Treks = require("../model/treks");
const Trips = require("../model/trips");
const TokenSchema = require("../model/tokenSchema");
const { generateOTP, mailTransport } = require("../utils/mail");
// const mailTransport = require("../utils/mail");


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

  const OTP = generateOTP();
  const tokenSchema = new TokenSchema({
    owner: newUser._id,
    token: OTP,
  });
  await tokenSchema.save();
  await newUser.save();
  mailTransport().sendMail({
    from: "rupeshadmin@gmail.com",
    to: newUser.email,
    subject: "Welcome To Treks & Trips",
    html: `<h1>${OTP}<h1>`,
  });
  res.send(newUser);
};

const signin = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return err(res, "email or password can not be empty");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return err(res, "no such user");
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
  let { title, description, level, seats, vacancy, cost, date } = req.body;
  date = new Date(date);
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

let createPostTrip = async (req, res) => {
  let { title, description, level, seats, vacancy, cost, date } = req.body;
  date = new Date(date);
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

const showPostTrek = async (req, res) => {
  const data = await Treks.find();
  res.send(data);
};

const showPostTrip = async (req, res) => {
  const data = await Trips.find();
  res.send(data);
};

const payment = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, //lowest denomination of particular currency
      currency: "usd",
      payment_method_types: ["card"], //by default
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

module.exports = {
  createUser,
  signin,
  createPostTrek,
  createPostTrip,
  showPostTrek,
  showPostTrip,
  payment,
};





