import Comment from "../../models/game/comment.model.js";
import Game from "../../models/game/game.model.js";
import Category from "../../models/game/category.model.js";
import mongoose from "mongoose";
import Rating from "../../models/game/rating.model.js";
import Points from "../../models/game/points.model.js";

export const postComment = async (req, res) => {
  const { userId, comment, picture, name ,dateTime } = req.body;
  const { gameid } = req.query;

  // console.log(name);
  const saveComment = new Comment({
    userId: userId,
    gameId: gameid,
    comment: comment,
    picture: picture,
    name: name,
    createdDate: new Date().toISOString(),
  });

  try {
    await saveComment.save();
    res.status(201).json(saveComment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {

  const skip = req.query.skip ? Number(req.query.skip) :0;
  const { gameid } = req.query;
  const DEFAULT_LIMIT = 2;

  try {
    const total = await Comment.find({gameId: gameid,}).countDocuments();
    const comments = await Comment.find({gameId: gameid,}).sort({createdDate:-1}).skip(skip).limit(DEFAULT_LIMIT);
    // console.log(comments)
    res.status(200).json({
      records:comments,
      total
    });
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

export const getAdminGames = async (req, res) => {

  try {
    const AdminGames = await Game.find();

    res.status(200).json(AdminGames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getLatestGames = async (req, res) => {
  const limit = req.body.limit ? Number(req.body.limit) :12;

  try {
    const LatestGames = await Game.find().sort({createdDate:-1}).limit(limit);

    res.status(200).json({records:LatestGames,
    limit:limit});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGames = async (req, res) => {

  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const DEFAULT_LIMIT = 12;

  try {
    const total = await Game.countDocuments();
    const AllGames = await Game.find().skip(skip).limit(DEFAULT_LIMIT);

    res.status(200).json({
      records:AllGames,
      total:total
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGamesBySearch = async (req, res) => {

  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const { searchQuery } = req.query;
  const DEFAULT_LIMIT = 12;

  try {
    const name = new RegExp(searchQuery, "i");
    const total = await Game.find({name: name,}).countDocuments();
    const getSearchGames = await Game.find({name: name,}).skip(skip).limit(DEFAULT_LIMIT);
    // console.log(getSearchGames)

    res.status(200).json({
      records:getSearchGames,
      total:total
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGamesByCategories = async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const { category } = req.query;
  const DEFAULT_LIMIT = 12;

  try {
    // const categoryName = new RegExp(category, "i");
    // console.log(categoryName);

    if (category === "Rewarded"){
      
      const total = await Game.find({isRewardGame :true,}).countDocuments();
      const getGameCategory = await Game.find({isRewardGame : true,}).skip(skip).limit(DEFAULT_LIMIT);
      res.status(200).json({
        records:getGameCategory,
        total:total
      });
    }
    else{
      const total = await Game.find({categories: category,}).countDocuments();
      const getGameCategory = await Game.find({categories: category,}).skip(skip).limit(DEFAULT_LIMIT);
      res.status(200).json({
        records:getGameCategory,
        total:total
      });
    } 
 
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const getAllCategories = await Category.find();
    //console.log('categories:::',getAllCategories);
    res.status(200).json(getAllCategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const saveRating = async (req, res) => {
  const { userid, gameid } = req.query;
  const { newValue } = req.body;
  
const ratingData = await Rating.find({ $and:[{ gameId:gameid},{userId:userid} ]}) 
//ratingData.map((rate) => ( console.log('mongoDB id:', rate._id))) 

      try {
        
      if (ratingData.length === 0){
            console.log('0',ratingData.length)          
            const newRating = new Rating({
              gameId: gameid,
              userId:userid,
              ratedValue:newValue
              
            });
            await newRating.save();
            res.status(201).json(newRating);
            //console.log('0',ratingData.length)

      }else if((ratingData.length === 1)){
      //console.log('raings',ratingData[0]._id)      
      
          await Rating.findByIdAndUpdate(ratingData[0]._id, {
            gameId: gameid,
            userId:userid,
            ratedValue:newValue
          });

        }else{
         alert('Unsuccussfull')
        }

      } catch (error) {
        res.status(404).json({ message: error.message });
      }
  }
  

  export const getAvgRating = async (req, res) => {
    const { gameid } = req.query;
  
    try {
    const ratingData = await Rating.find({gameId: gameid,});

     res.status(200).json({ratingData})
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  export const getPoints = async (req, res) => {
    const { gameid } = req.query;

    try {
      const pointData = await Points.find({gameId: gameid,}).sort({score:-1}).limit(11)
      res.status(200).json({pointData});
      
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };


  export const postPoints = async (req, res) => {
    const { userid, gameid } = req.query;
    const { score ,name ,picture } = req.body;
    
  const pointData = await Points.find({ $and:[{ gameId:gameid},{userId:userid} ]}) 
  //ratingData.map((rate) => ( console.log('mongoDB id:', rate._id))) 
  
        try {
          
        if (pointData.length === 0){
              console.log('0',pointData.length)          
              const newPoint = new Points({
                gameId: gameid,
                userId:userid,
                score:score,
                picture:picture,
                name:name,
                
              });
              await newPoint.save();
              res.status(201).json(newPoint);
              //console.log('0',ratingData.length)
  
        }else if((pointData.length === 1)){
        //console.log('raings',ratingData[0]._id)      
        
            await Points.findByIdAndUpdate(pointData[0]._id, {
              gameId: gameid,
              userId:userid,
              score:score,
              picture:picture,
              name:name,
            });
  
          }else{
           alert('Unsuccussfull')
          }
  
        } catch (error) {
          res.status(404).json({ message: error.message });
        }
    }



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
