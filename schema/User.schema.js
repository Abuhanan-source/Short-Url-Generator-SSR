import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  Role: {
    type: String,
    default: "User",
  },

  otpexpiry:{
    type: Date,
  },

  verifyUser:{
    type: Boolean,
    default: false,
  },

  userOtp:{
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
},{timestamps: true});

const Usermodel = mongoose.model("User", UserSchema);

export default Usermodel;