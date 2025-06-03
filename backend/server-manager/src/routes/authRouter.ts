import e from "express";
import { logoutUser, sendOtp } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authenticate";
import { getUserInfo } from "../controllers/serverController";

const authRouter=e.Router();

authRouter.post("/send-otp",sendOtp);

authRouter.get("/checkforcookies",authenticateUser,getUserInfo);

authRouter.post("/logout",logoutUser);

export default authRouter;