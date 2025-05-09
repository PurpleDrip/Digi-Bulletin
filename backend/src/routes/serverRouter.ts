import { Router } from "express";

const serverRouter = Router();

serverRouter.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
});

export default serverRouter;