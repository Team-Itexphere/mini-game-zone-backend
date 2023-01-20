import express from "express";
import {
  createGame,
  getComments,
  getGameDetails,
  postComment,
  getGames,
  getGamesBySearch,
  getGamesByCategories,
  getAllCategories,
  saveRating,
  // getRewardGames,
  postCategory,
  deleteCategory,
  updateCategory,
  updateGame,
  deleteGame,
  getAdminGames,
  getLatestGames,
} from "../controllers/game/game.controller.js";

const router = express.Router();

router.post("/comment", postComment);
router.get("/getcomments", getComments);
router.post("/", createGame);
router.get("/", getGameDetails);
router.get("/all", getGames);
router.get("/adminGames",getAdminGames)
router.get("/latestGames",getLatestGames)
router.get("/search", getGamesBySearch);
router.get("/categories", getGamesByCategories);
router.get("/allCategory", getAllCategories);
router.post("/rate", saveRating);
router.post("/category", postCategory);
router.delete("/deleteCategory", deleteCategory);
router.put("/updateCategory", updateCategory);
router.put("/updateGame", updateGame);
router.delete("/deleteGame", deleteGame);
// http://localhost:5000/game/comment get post
// http://localhost:5000/game

export default router;
