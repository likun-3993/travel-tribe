const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://user:user@cluster0.hsvp2.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));
