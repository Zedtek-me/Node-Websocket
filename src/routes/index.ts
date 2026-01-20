import { Router } from "express";
import userRoutes from "router";

const router: Router = new Router();

router.use("/api/v1", userRoutes);

router.all(
    "*all", (req, res) =>{
        res.status(404).json({
            message: "page not found",
            data: {},
            status: "error"
        })
    }
)


export default router;