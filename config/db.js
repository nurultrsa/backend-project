const mongoose = require("mongoose");

//Setting up Mongoose with MongoDB
const mongodbURI = process.env.mongodbURI;

module.exports = () => {
  mongoose.connect(
    mongodbURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, res) => {
      if (err)
        console.error(`Error occured while connecting to MongoDB! \n${err}`);
      else console.log(`MongoDB connected...`);
    }
  );
};