import e from "express";
import { sendOtp } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authenticate";
import { getUserInfo } from "../controllers/serverController";

const authRouter=e.Router();

authRouter.post("/send-otp",sendOtp);

authRouter.get("/checkforcookies",authenticateUser,getUserInfo);

export default authRouter;