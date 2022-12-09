import Comment from "../../models/game/comment.model.js";
import Game from "../../models/game/game.model.js";
import Category from "../../models/game/category.model.js";
import mongoose from "mongoose";

export const postComment = async (req, res) => {
  const { userId, comment, picture, name } = req.body;
  const { gameid } = req.query;

  // console.log(name);
  const saveComment = new Comment({
    userId: userId,
    gameId: gameid,
    comment: comment,
    picture: picture,
    name: name,
  });

  try {
    await saveComment.save();
    res.status(201).json(saveComment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  const { gameid } = req.query;
  // console.log(gameid)

  try {
    const comments = await Comment.find({
      gameId: gameid,
    });
    // console.log(comments)
    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createGame = async (req, res) => {
  // console.log(req.body);
  const gameDetails = req.body;

  const newGame = new Game({
    ...gameDetails,
    uploadDate: new Date().toISOString(),
  });

  try {
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getGameDetails = async (req, res) => {
  const { gameid } = req.query;

  try {
    const dbComments = await Comment.find({
      gameId: gameid,
    });

    const dbGameDetails = await Game.findById(gameid);

    const gameData = {
      comments: dbComments,
      gameDetails: dbGameDetails,
    };

    res.status(200).json(gameData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getGames = async (req, res) => {
  try {
    const getAllGames = await Game.find();
    res.status(200).json(getAllGames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGamesBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const name = new RegExp(searchQuery, "i");
    const getSearchGames = await Game.find({
      name: name,
    });
    // console.log(getSearchGames)

    res.status(200).json(getSearchGames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGamesByCategories = async (req, res) => {
  const { category } = req.query;

  try {
    // const categoryName = new RegExp(category, "i");
    // console.log(categoryName);
    const getGameCategory = await Game.find({
      categories: category,
    });
    res.status(200).json(getGameCategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const getAllCategories = await Category.find();
    // console.log(getAllCategories);
    res.status(200).json(getAllCategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const saveRating = async (req, res) => {
  const { userid, gameid } = req.query;
  const { newValue } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(gameid))
      return res.status(404).send(`No Game with that id: ${gameid} `);

    const gameData = await Game.findById(gameid);
    const index = gameData.rating.findIndex(
      ({ userId }) => userId === String(userid)
    );

    // console.log('index:', index)

    if (index === -1) {
      // fist time rating
      gameData.rating.push({ userId: userid, ratedValue: newValue });
    } else {
      // user want to change their rating
      gameData.rating = gameData.rating.filter(
        ({ userId }) => userId !== String(userid)
      );
      gameData.rating.push({ userId: userid, ratedValue: newValue });
    }

    await Game.findByIdAndUpdate(gameid, gameData, { new: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRewardGames = async (req, res) => {
  try {
    const getAllRewardGames = await Game.find({
      isRewardGame: "true",
    });

    res.status(200).json(getAllRewardGames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//post category
export const postCategory = async (req, res) => {
  const { categoryName, description, _id, icon } = req.body;

  const saveCategory = new Category({
    categoryName: categoryName,
    description: description,
    _id: _id,
    icon: icon,
  });
  try {
    await saveCategory.save();
    res.status(201).json(saveCategory);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//delete category
export const deleteCategory = async (req, res) => {
  const { _id } = req.body;
  // console.log(_id);
  try {
    await Category.findByIdAndDelete(_id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//update category
export const updateCategory = async (req, res) => {
  const { _id, categoryName, description } = req.body;
  // console.log(_id);
  try {
    await Category.findByIdAndUpdate(_id, {
      categoryName: categoryName,
      description: description,
    });
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//update game
export const updateGame = async (req, res) => {
  const { _id, name, description, imgUrl, categories, isRewardGame, gameUrl } =
    req.body;
  // console.log(_id);
  try {
    await Game.findByIdAndUpdate(_id, {
      name: name,
      description: description,
      imgUrl: imgUrl,
      categories: categories,
      isRewardGame: isRewardGame,
      gameUrl: gameUrl,
    });
    res.status(200).json({ message: "Game updated successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//delete game
export const deleteGame = async (req, res) => {
  const { _id } = req.body;
  // console.log(_id);
  try {
    await Game.findByIdAndDelete(_id);
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
