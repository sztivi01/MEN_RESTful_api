const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let keyboardsSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    inStock: { type: Boolean },
  }

  //name : string
  //description :string
  //price :number
  //inStock :boolean
);

module.exports = mongoose.model("keyboards", keyboardsSchema);
