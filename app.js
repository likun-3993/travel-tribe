const express = require("express");
// require("./db");
require("dotenv").config();
var cors = require("cors");
const app = express();
// const user = require("./router/user");
app.use(cors());
app.use(express.json());

// app.use("/api/user", user);

app.get("/", (req, res) => res.send("running"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("running at port 8000");
});
