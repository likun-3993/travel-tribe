const express = require("express");
require("./db");
const path = require("path");
require("dotenv").config();
var cors = require("cors");
const app = express();
var Razorpay = require("razorpay");
var bodyParser = require("body-parser");
const user = require("./router/user");
const Treks = require("./model/treks");
let identity;
let pay;
let seats;
let instance = new Razorpay({
  key_id: "rzp_test_XPknkE3UikXlnX", // your `KEY_ID`
  key_secret: "gRf8XwhbQcearTaUO4TZFUQb", // your `KEY_SECRET`
});

app.use("/web", express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/create/orderId", (req, res) => {
  var options = {
    amount: pay,
    currency: "INR",
    receipt: "rcp1",
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    res.send({ orderId: order.id, amount: pay });
  });
});

app.post("/api/payment/verify", async (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "gRf8XwhbQcearTaUO4TZFUQb")
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature) {
    response = { signatureIsValid: "true" };
    const data = await Treks.findOne({ _id: identity });
    data.vacancy = data.vacancy - seats;
    await data.save();
    // res.send(data);
  }
  console.log({ ...response, success: true });
  res.send({ ...response, success: true });
});

app.use(cors());
app.use(express.json());

app.use("/api/user", user);

app.post("/initiate", (req, res) => {
  const { _id, cost, booked } = req.body;
  identity = _id;
  pay = cost * 100;
  seats = booked;
  res.send({ identity, pay, seats });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const PORT = process.env.PORT || 8001;

const x = new Date();
console.log(x);

app.listen(PORT, () => {
  console.log("running at port 8001");
});
