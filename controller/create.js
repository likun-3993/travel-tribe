const User = require("../model/user");
const { err } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const Treks = require("../model/treks");
const Trips = require("../model/trips");
const TokenSchema = require("../model/tokenSchema");
const nodemailer = require("nodemailer");
const { generateOTP } = require("../utils/mail");

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

  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: "rupeshadm90@gmail.com",
      pass: "srhuhomwjqxejduu",
    },
    tls: {
      rejectUnauthorized: false,
    },
    host: "smtp.gmail.com",
  });

  let info = await transporter.sendMail({
    from: "rupeshadm90@gmail.com", // sender address
    to: newUser.email, // list of receivers
    subject: "test otp", // Subject line
    text: `${OTP}`, // plain text body
  });

  // transporter.sendMail(info, (error, inf) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  // });

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
  let {
    title,
    description,
    level,
    seats,
    vacancy,
    images,
    cost,
    tim,
    date,
    meeting_place,
  } = req.body;

  date = new Date(date);

  const data = new Treks({
    title,
    description,
    level,
    seats,
    vacancy,
    cost,
    images,
    Stime: tim.start_value,
    Ftime: tim.end_value,
    date,
    meeting_place,
  });
  await data.save();
  res.json({
    success: true,
    data,
  });
};

const createPostTrip = async (req, res) => {
  let {
    title,
    description,
    level,
    seats,
    vacancy,
    images,
    cost,
    tim,
    date,
    start_point,
    destination_point,
  } = req.body;

  date = new Date(date);

  const data = new Trips({
    title,
    description,
    level,
    seats,
    vacancy,
    images,
    cost,
    Stime: tim.start_value,
    Ftime: tim.end_value,
    date,
    start_point,
    destination_point,
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

module.exports = {
  createUser,
  signin,
  createPostTrek,
  createPostTrip,
  showPostTrek,
  showPostTrip,
};
