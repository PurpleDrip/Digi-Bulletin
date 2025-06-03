import { Router } from "express";
import { getMessages } from "../controllers/messageController";

const messageRouter = Router();

messageRouter.get("/get-messages", getMessages);


export default messageRouter;