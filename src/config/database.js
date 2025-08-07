const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "bich"
  );
};

module.exports = connectDb;
