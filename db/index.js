const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb://user:user@cluster0-shard-00-00.hsvp2.mongodb.net:27017,cluster0-shard-00-01.hsvp2.mongodb.net:27017,cluster0-shard-00-02.hsvp2.mongodb.net:27017/?ssl=true&replicaSet=atlas-gwlfgd-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

