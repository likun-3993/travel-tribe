const router = require("express").Router();
const {
  createUser,
  signin,
  payment,
  showPostTrek,
  showPostTrip,
  createPostTrek,
  createPostTrip,
} = require("../controller/create");
const { validator, validate } = require("../middleware/Validator");

router.post("/create", validator, validate, createUser);
router.post("/signin", signin);
router.post("/posttrek", createPostTrek);
router.post("/posttrip", createPostTrip);
router.get("/posttrek", showPostTrek);
router.get("/posttrip", showPostTrip);
router.post("/create-payment-intent", payment);

router.get("/", (req, res) => {
  res.send("hello there !!!");
});

module.exports = router;
