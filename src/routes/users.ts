import { Router } from "express";
import UserController from "../controllers/users";

const router: Router = new Router();

router.get("/user/:id", UserController.singleUser);

export default router;