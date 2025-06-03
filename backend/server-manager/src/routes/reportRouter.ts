import { Router } from "express";

const reportRouter = Router();

reportRouter.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
});

export default reportRouter;