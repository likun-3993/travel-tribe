const { check, validationResult } = require("express-validator");

exports.validator = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("name is missing")
    .isLength({ min: 3, max: 20 })
    .withMessage("name must be within 3 to 20 characters long"),
  check("email").normalizeEmail().isEmail().withMessage("invalid email"),
  check("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("must have more than 8 characters")
    .not()
    .isEmpty()
    .withMessage("password can not be empty"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length)
    return res.status(400).json({ success: false, error: error[0].msg });
  else return next();
};

// module.exports = { validate, validator };
