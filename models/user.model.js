import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  picture: String,
  id: { type: String },
  country: String,
  aboutMe: String,
  contactPhone: String,
  address: String,
  refUserId: String,
  points: Number,
  isAdmin: String,
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
