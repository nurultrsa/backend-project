const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

//Middlewares
const auth = require("../middlewares/auth");
const Contact = require("../models/contact");

// @route   GET api/contacts
// @desc    Get all the contacts of the logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    //Find contacts of the user
    const contacts = await Contact.find({ user: req.user.id });

    if (contacts.length > 0) {
      return res.json(contacts);
    } else {
      return res.status(400).json({ msg: "No contacts found!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

// @route   POST api/contacts
// @desc    Add a new contact for the logged in user
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required!").exists(),
      check("email", "Please provide a valid email!").isEmail(),
      check("phone", "Phone number is required!").exists(),
    ],
  ],
  async (req, res) => {
    //Checking validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //If no validation error, then proceed to store in DB
    const { name, email, phone, type } = req.body;

    //Checking for duplicate contact entry with check unique email/phone
    let isDuplicate = await Contact.find({
      $and: [
        { user: req.user.id },
        { $or: [{ email: email }, { phone: phone }] },
      ],
    });

    if (isDuplicate.length > 0) {
      return res.status(400).json({
        msg: `Duplicate entry attempt! Contact ${
          email == isDuplicate[0].email ? "Email" : "Phone Number"
        } already exists!`,
      });
    }

    //If request is not duplicate, then proceed and store in DB
    try {
      let newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      newContact = await newContact.save();
      res.json(newContact);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error!");
    }
  }
);

// @route   PUT api/contacts
// @desc    Update a contact of the logged in user
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //Building contactFields object
  let contactFields = {};

  //Checking if fields exist and then running validation
  if (name) {
    await check("name", "Please provide a name!").exists().run(req);
    contactFields.name = name;
  }
  if (email) {
    await check("email", "Please Provide a valid email!").isEmail().run(req);
    contactFields.email = email;
  }
  if (phone) {
    await check("phone", "Please provide a phone number").exists().run(req);
    contactFields.phone = phone;
  }
  if (type) {
    check("type", "Please provide a contact type!").exists().run(req);
    contactFields.type = type;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    //Fetching contact from db
    let contact = await Contact.findById(req.params.id);

    //Check if contact exists or not
    if (!contact) return res.status(404).json({ msg: "Contact not found!" });

    //Checking if the contact's owner is as same as the incoming request maker by matching user ids
    if (contact.user != req.user.id)
      return res.status(401).json({ msg: "Un-authorized attempt!" });

    //If user is authorized, proceed

    //Check for duplicate email or phone number in any contact of the user
    const isDuplicate = await Contact.find({
      $and: [
        { user: req.user.id },
        { $or: [{ email: email }, { phone: phone }] },
      ],
    });

    if (isDuplicate.length > 0) {
      return res.status(400).json({
        msg: `Duplicate update attempt! A contact with that ${
          email == isDuplicate[0].email ? "Email" : "Phone Number"
        } already exists!`,
      });
    }

    //If there's no duplicate, proceed
    //Save and update db
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields,
      },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

// @route   DELETE api/contacts
// @desc    Delete a contact of the logged in user
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    //Fetching contact from db
    let contact = await Contact.findById(req.params.id);

    //Check if contact exists or not
    if (!contact) return res.status(404).json({ msg: "Contact not found!" });

    //Checking if the contact's owner is as same as the incoming request maker by matching user ids
    if (contact.user != req.user.id)
      return res.status(401).json({ msg: "Un-authorized attempt!" });

    //If user is authorized, proceed
    const isDeleted = await Contact.findByIdAndDelete(req.params.id);
    res.json(isDeleted);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;