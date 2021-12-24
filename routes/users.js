const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Using express validator
const { check, validationResult } = require("express-validator");

//User Model
const User = require("../models/user");

// @route   POST api/users
// @desc    Register an user and generate JWT token
// @access  Public

router.post(
  "/",
  [
    check("name", "Please enter a valid name").not().isEmpty(),
    check("email", "Please enter a valid email address!").isEmail(),
    check(
      "password",
      "Please enter a valid password with atleast 5 or more characters!"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    //Checking validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array()[0] });

    //If there's no validation errors, proceed
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ msg: "User with that email already exists!" });
      }

      user = new User({
        name,
        email,
        password,
      });

      //Generating salt using bcrypt
      const salt = await bcrypt.genSalt(10);

      //Hashing password with salt
      user.password = await bcrypt.hash(password, salt);

      //Saving user
      await user.save();

      //Generate JWT Token
      //Create payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      //Sign JWT token with secret
      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: "60" },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  }
);

module.exports = router;