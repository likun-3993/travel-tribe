const router = require("express").Router();
const {
  createUser,
  signin,
  showPosts,
  createPostTrek,
  createPostTrip,
} = require("../controller/create");
const { validator, validate } = require("../middleware/Validator");

router.post("/create", validator, validate, createUser);
router.post("/signin", signin);
router.post("/posttrek", createPostTrek);
router.post("/posttrip", createPostTrip);
router.get("/post", showPosts);

router.get("/", (req, res) => {
  res.send('hello there !!!');
});

module.exports = router;
