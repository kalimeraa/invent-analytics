import { Router } from "express";
import bookController from "../controllers/book.controller";

const bookRoutes = Router();
bookRoutes.post("/books", bookController.store);
bookRoutes.get("/books", bookController.index);
bookRoutes.get("/books/:id", bookController.show);

export { bookRoutes };
