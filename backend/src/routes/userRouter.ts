import { Response, Router } from "express";
import { validateLoginUserInput, validateRegisterUserInput } from "../middlewares/validate";
import { approveUser, getPendingAcc, registerUser, updateUser } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authenticate";
import { appendCookies } from "../controllers/authController";

const userRouter = Router();

userRouter.get('/', async (req, res, next)=> {
    console.log("Router Working");
    res.end();
});

userRouter.post("/register-user",validateRegisterUserInput,registerUser)

userRouter.post("/login-user",validateLoginUserInput,appendCookies,(req,res:Response):void=> {
    res.status(200).json({success:true,message:"Successfully logged in."});
    return;
    })

userRouter.get("/pending-acc",authenticateUser,getPendingAcc);

userRouter.post("/update-user",authenticateUser,updateUser)

userRouter.post("/approve-user",authenticateUser,approveUser)


export default userRouter;