import express from "express";
import { VerifyToken } from "../middleware/middleware.js";
const userRouter = express.Router();

import {
  UserSignUp,
  userLogin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByOrganizationId,
  changePassword,
} from "../controllers/UserController.js";

userRouter.post("/signup", UserSignUp);
userRouter.post("/login", userLogin);

userRouter.get("/", VerifyToken, getAllUsers);
userRouter.get("/:id", VerifyToken, getUserById);
userRouter.put("/:id", VerifyToken, updateUser);
userRouter.patch("/password/:id", VerifyToken, changePassword);
// userRouter.delete('/:id', VerifyToken, deleteUser);
userRouter.get("/org/:orgid", VerifyToken, getUserByOrganizationId);

export { userRouter };
