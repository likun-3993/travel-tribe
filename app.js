const express = require("express");
require("./db");
const path = require("path");
require("dotenv").config();
var cors = require("cors");
const app = express();
var Razorpay = require("razorpay");
var bodyParser = require("body-parser");
const user = require("./router/user");

let instance = new Razorpay({
  key_id: "rzp_test_XPknkE3UikXlnX", // your `KEY_ID`
  key_secret: "gRf8XwhbQcearTaUO4TZFUQb", // your `KEY_SECRET`
});

app.use("/web", express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/payment/order", (req, res) => {
  params = req.body;
  instance.orders
    .create(params)
    .then((data) => {
      res.send({ sub: data, status: "success" });
    })
    .catch((error) => {
      res.send({ sub: error, status: "failed" });
    });
});

app.post("/api/payment/verify", (req, res) => {
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "gRf8XwhbQcearTaUO4TZFUQb")
    .update(body.toString())
    .digest("hex");
  console.log("sig" + req.body.razorpay_signature);
  console.log("sig" + expectedSignature);
  var response = { status: "failure" };
  if (expectedSignature === req.body.razorpay_signature)
    response = { status: "success" };
  res.send(response);
});

app.use(cors());
app.use(express.json());

app.use("/api/user", user);

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("running at port 8000");
});

