import express from "express";
import {
  getUser,
  signin,
  updatePoints,
  // updateUser,
  getAllUsers,
  postUsers,
  deletetUsers,
  updateUsers,
  contactUs,
  getAllcontactUs,
  deleteContactUs,
} from "../controllers/user/user.controller.js";

const router = express.Router();

router.post("/signin", signin);
router.get("/", getUser);
// router.put("/:id", updateUser);
router.post("/points", updatePoints); // http://localhost:5000/user/points?points=77777&userid=2222
router.get("/all", getAllUsers);
router.post("/add", postUsers);
router.delete("/deleteuser", deletetUsers);
router.put("/updateuser", updateUsers);

router.get("/getmessage",getAllcontactUs);
router.post("/postmessage",contactUs);
router.delete("/deletemessage",deleteContactUs);

export default router;
