import mongoose from "mongoose";

const ratingSchema = mongoose.Schema({
  gameId: String,
  userId: String,
  ratedValue: Number,
  id: String,
  createdDate:{
    type: Date,
    default: new Date(),
  }
});

const Rating = mongoose.model("rating", ratingSchema);

export default Rating;