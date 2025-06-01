import { Router } from "express";
import { getMessages } from "../controllers/messageController";

const messageRouter = Router();

messageRouter.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
});

messageRouter.get("/get-messages", getMessages);


export default messageRouter;