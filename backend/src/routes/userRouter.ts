import { Router } from "express";
import { validateRegisterUserInput } from "../middlewares/validate";
import { registerUser } from "../controllers/userController";

const userRouter = Router();

userRouter.get('/', async (req, res, next)=> {
    console.log("Router Working");
    res.end();
});

userRouter.post("/register-user",validateRegisterUserInput,registerUser)

// userRouter.post("/login-user",validateLoginUserInput)

export default userRouter;