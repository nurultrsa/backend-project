const express = require("express");
require("dotenv").config();

//Importing db connection method from db config
const connectDB = require("./config/db");

const app = express();

//Body parser
app.use(express.json());

//Defining routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

//Connecting MongoDB
connectDB();

//Setting up server port
const PORT = process.env.PORT || 5000;

//Starting server
app.listen(PORT, (err, res) => {
  if (err) {
    console.error(`Error occured while starting server! ${err}`);
  } else {
    console.log(`Server started at port ${PORT}...`);
  }
});