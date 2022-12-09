import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
  name: String,
  description: String,
  imgUrl: String,
  categories: String,
  id: String,
  gameUrl: String,
  uploadDate: {
    type: Date,
    default: new Date(),
  },
  isRewardGame: String,
  rating: [
    {
      userId: String,
      ratedValue: Number,
    },
  ],
});

const Game = mongoose.model("GameData", gameSchema);

export default Game;
