import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";

import UserModel from "../../models/user.model.js";
import { addPoints } from "../../constant/constant.js";
import Message from "../../models/contactUs.model.js";

const client = new OAuth2Client("862901280150-r12s47uku8p1vutqnjhagfgkppk81qq2.apps.googleusercontent.com"
  // "988836340451-pqpi4evnl7qut2h2b647p5rttkjrqbg0.apps.googleusercontent.com"
);

export const signin = (req, res) => {
  const { tokenId, refUserId } = req.body;
  // console.log('tokenId', tokenId)
  // console.log('refUserId', refUserId)

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:"862901280150-r12s47uku8p1vutqnjhagfgkppk81qq2.apps.googleusercontent.com"
        // "988836340451-pqpi4evnl7qut2h2b647p5rttkjrqbg0.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, name, email, picture } = response.payload;
      // console.log('response.payload --', response.payload);

      if (email_verified) {
        UserModel.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: "Something went wrong ...",
            });
          } else {
            if (user) {
              //  console.log('user in db')
              const token = jwt.sign({ _id: user._id }, "test", {
                expiresIn: "7d",
              });
              const { _id, name, email, picture, isAdmin, points } = user;

              res.json({
                token,
                user: { _id, name, email, picture, isAdmin, points },
              });
            } else {
              //  console.log('user not in db')
              let password = email;
              let newUser;

              if (refUserId) {
                // console.log('user has refId db')
                newUser = new UserModel({
                  name,
                  email,
                  password,
                  picture,
                  refUserId,
                });
              } else {
                newUser = new UserModel({ name, email, password, picture });
              }

              newUser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: "Something went wrong... in creating user",
                  });
                }
                const token = jwt.sign({ _id: data._id }, "test", {
                  expiresIn: "7d",
                });
                const { _id, name, email, picture, points } = newUser;

                // findUserById(refUserId)
                // const user = User.findById(`61a710bd42a76cb6b0f82f15`);
                // console.log('gg',{ _id, name, email, picture })

                res.json({
                  token,
                  user: { _id, name, email, picture, points },
                });
              });

              if (refUserId) {
                findUserById(refUserId);
              }
            }
          }
        });
      }
    });

  const findUserById = async (refUserId) => {
    const user = await UserModel.findById(refUserId);
    let updatedUserPoint;
    // console.log('gg', user)

    if (user.points) {
      updatedUserPoint = { points: user.points + 10 };
      const pp = await UserModel.findByIdAndUpdate(refUserId, {
        points: user.points + addPoints,
      });
      // console.log('22ss:', pp)
    } else {
      // updatedUserPoint = { points: 10 }
      const pp = await UserModel.findByIdAndUpdate(refUserId, {
        points: addPoints,
      });
      // console.log('22ss:', pp)
    }
    // user.points.push(refUserId);
    // console.log('22ss', updatedUserPoint)
    // const ggs = User.findByIdAndUpdate(refUserId, updatedUserPoint);
    // console.log('22ss', ggs)
  };
};

export const getUser = async (req, res) => {
  const { userId } = req.query;
  // console.log(userId)

  const undefineUser = {
    name: "Unknown",
    picture:
      "https://cdn5.vectorstock.com/i/thumb-large/45/79/male-avatar-profile-picture-silhouette-light-vector-4684579.jpg",
  };

  if (userId == "undefined") {
    res.status(200).json(undefineUser);
  } else {
    try {
      const user = await UserModel.findById(userId);
      // const roomConversation = post.conversation
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

// export const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No User with id: ${id}`);
//   try {
//     await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });

//     res.json(updatedUser);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const updatePoints = async (req, res) => {
  // const userId = req.params;
  const { points, userid } = req.query;

  const newPoints = Number(points);

  // if(typeof newPoints !== 'number' || newPoints === "NaN" ) return res.status(404).send(`points must be a number not a string: ${points}`);

  const user = await UserModel.findById(userid);
  //     // console.log('gg', user)

  if (user.points) {
    const pp = await UserModel.findByIdAndUpdate(userid, {
      points: user.points + newPoints,
    });
    // console.log('22ss:', pp)
  } else {
    // updatedUserPoint = { points: 10 }
    const pp = await UserModel.findByIdAndUpdate(userid, { points: newPoints });
    // console.log('22ss:', pp)
  }
};

// users insert, update, delete
export const getAllUsers = async (req, res) => {
  try {
    const getAllCategories = await UserModel.find();
    console.log('getUsers',getAllCategories);
    res.status(200).json(getAllCategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postUsers = async (req, res) => {
  //console.log(getAllCategories);
  const { name, email, points } = req.body;
  const saveUser = new UserModel({
    name: name,
    email: email,
    points: points,
  });

  try {
    await saveUser.save();
    res.status(200).json(saveUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletetUsers = async (req, res) => {
  const { _id } = req.body;
  try {
    await UserModel.findByIdAndDelete(_id);
    //console.log('err')
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUsers = async (req, res) => {
  const { _id, name, country, aboutMe , address , contactPhone  } = req.body;
  try {
    await UserModel.findByIdAndUpdate(_id, {
      name: name,
      country:country,
      aboutMe: aboutMe,
      address: address,
      contactPhone:contactPhone  
      // email: email,
      // points: points,
    });
    //console.log('err')
    res.status(200).json({ message: "successfully updated" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllcontactUs = async (req, res) => {
  try {
    const getAllMessages = await Message.find();
    // console.log(getAllCategories);
    res.status(200).json(getAllMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const contactUs = async (req, res) => {
  console.log('getAllmessages',res);
  const {userId ,firstName ,lastName, email, message } = req.body;
  const saveMessage = new Message({
    userId:userId,
    firstName:firstName,
    lastName: lastName,
    email: email,
    message: message,
  });

  try {
    await saveMessage.save();
    res.status(200).json(saveMessage);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const deleteContactUs = async (req, res) => {
  const { _id } = req.body;
  try {
    await Message.findByIdAndDelete(_id);
    //console.log('err')
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};