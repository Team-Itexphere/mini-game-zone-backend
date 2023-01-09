import mongoose from "mongoose";

const contactUsSchema = mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  email:String,
  message:String

});

const Message = mongoose.model("message", contactUsSchema);

export default Message;