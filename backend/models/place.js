const mongoose = require("mongoose");
const { Schema } = mongoose;

const placesSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lng: { type: Number, required: true },
    lat: { type: Number, required: true }
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
})

module.exports = mongoose.model('places', placesSchema)