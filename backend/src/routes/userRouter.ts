import { Router } from "express";

const userRouter = Router();

userRouter.get('/', async (req, res, next)=> {
    console.log("Router Working");
    res.end();
});

export default userRouter;