import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  userId: String,
  gameId: String,
  comment: String,
  picture: String,
  name: String,
  dateTime:{
    type: Date,
    default: new Date(),
  }
});

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
