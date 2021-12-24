const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Using express validator to validate incoming request data on server side
const { check, validationResult } = require("express-validator");

//Middlewares
const auth = require("../middlewares/auth");

//User Model
const User = require("../models/user");

// @route   GET api/auth
// @desc    Get details of a logged In user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email address!").isEmail(),
    check("password", "Password is required!").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    //Checking validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //If no validation errors, proceed
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //Checking invalid email
      if (!user) {
        return res
          .status(400)
          .json({ msg: "No account was found with this email address!" });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      //Checking invalid password
      if (!isPasswordMatch) {
        return res.status(400).json({ msg: "Wrong password!" });
      }

      //If email + password are okay then generate JWT token
      //Creating payload

      const payload = {
        user: {
          id: user.id,
        },
      };

      //Sign and create
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
      //
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error!");
    }
  }
);

module.exports = router;