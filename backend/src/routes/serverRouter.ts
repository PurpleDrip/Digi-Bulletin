import {  Router } from "express";
import { appendAudience, createServer } from "../controllers/serverController";
import { authenticateOwner, authenticateUser } from "../middlewares/authenticate";

const serverRouter = Router();

serverRouter.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
});

serverRouter.post("/create-server",authenticateUser, authenticateOwner,createServer)

serverRouter.post("/add-audience",authenticateUser, authenticateOwner, appendAudience)

export default serverRouter;