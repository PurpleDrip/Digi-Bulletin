import e from "express";
import { sendOtp, validateOtp } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authenticate";
import { getUserInfo } from "../controllers/serverController";

const authRouter=e.Router();

authRouter.get("/send-otp",sendOtp);

authRouter.post("/validate-otp",validateOtp)

authRouter.get("/checkforcookies",authenticateUser,getUserInfo);

export default authRouter;