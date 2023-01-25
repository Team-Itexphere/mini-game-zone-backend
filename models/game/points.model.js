import mongoose from "mongoose";

const pointsSchema = mongoose.Schema({
  gameId: String,
  userId: String,
  score: Number,
  id: String,
  name:String,
  picture: String,
  createdDate:{
    type: Date,
    default: new Date(),
  }
});

const Points = mongoose.model("point", pointsSchema);

export default Points;