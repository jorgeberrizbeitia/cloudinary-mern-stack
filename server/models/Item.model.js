const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  image: String, // will be the URL from cloudinary
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
