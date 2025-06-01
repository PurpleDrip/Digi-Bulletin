import { Router } from "express";

const messageRouter = Router();

messageRouter.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
});

export default messageRouter;