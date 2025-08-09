const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:JEW9oxG5VFA3KpXv@cluster0.bumbj.mongodb.net/plushy"
  );
};

module.exports = connectDb;
