const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId, 
  },
  location: {
    lat: String,
    log: String,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  caption: {
    type: String,
  },
  dCreatedDate: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
// Create a pre-save middleware to update modifyDate before saving
ImageSchema.pre("save", function (next) {
  this.modifyDate = new Date();
  next();
});

module.exports = mongoose.model("imageModel", ImageSchema);
