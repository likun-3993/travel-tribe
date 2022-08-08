const User = require("../model/user");
const { err } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const Treks = require("../model/treks");
const Trips = require("../model/trips");
const Stripe = require("stripe");
const PUBLISHABLE_KEY = "pk_test_51LUPknSBcrxbib0Myl5Ya1XT4VLSeeKCiFCwPKTwqFeXg086HRyNZXG3JbBa1oAyx03ehAJu4mbyzMAuPTk9RxNE00OVXsm3SQ";
const SECRET_KEY = "sk_test_51LUPknSBcrxbib0MMHB2JVApkMPMnwkp5T9Y1a7rqpGFFqPqD8r0NaBjbhXZEEH3ty6I1TzmdCgyO0nwmIbK0HCu00orqiYWhU";
const stripe = Stripe(SECRET_KEY, { apiVersion: "2022-08-01" });

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


