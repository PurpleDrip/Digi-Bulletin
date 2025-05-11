import { Router } from "express";
import { validateRegisterUserInput } from "../middlewares/validate";

const userRouter = Router();

userRouter.get('/', async (req, res, next)=> {
    console.log("Router Working");
    res.end();
});

userRouter.post("/register-user",validateRegisterUserInput)

export default userRouter;