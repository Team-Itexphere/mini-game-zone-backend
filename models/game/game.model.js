import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
  name: String,
  description: String,
  imgUrl: String,
  categories: String,
  id: String,
  gameUrl: String,
  createdDate: {
    type: Date,
    default: new Date(),
  },
  isRewardGame: String,

});

const Game = mongoose.model("Game", gameSchema);

export default Game;
