import e from "express";
import { sendOtp, validateOtp } from "../controllers/authController";

const authRouter=e.Router();

authRouter.get("/send-otp",sendOtp);

authRouter.post("/validate-otp",validateOtp)

export default authRouter;