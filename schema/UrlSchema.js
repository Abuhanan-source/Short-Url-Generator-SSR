import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  shortUrlId: {
    type: String,
    required: true,
    unique: true,
  },

  RedirectUrl: {
    type: String,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  urlClickHistory: [{timestamps: {type:Number}}],
},{timestamps: true});

const URLmodel = mongoose.model("UrlDetails", UrlSchema);

export default URLmodel;