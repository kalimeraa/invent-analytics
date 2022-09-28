import { Router } from "express";
import userController from "../controllers/user.controller";

const userRoutes = Router();
userRoutes.post("/users", userController.store);
userRoutes.get("/users", userController.index);
userRoutes.get("/users/:id", userController.show);
userRoutes.post("/users/:userId/borrow/:bookId", userController.borrowBook);
userRoutes.post("/users/:userId/return/:bookId", userController.returnBook);

export { userRoutes };
