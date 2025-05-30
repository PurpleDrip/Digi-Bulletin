import {  Router } from "express";
import { appendAudience, createServer, getServers } from "../controllers/serverController";
import { authenticateOwner, authenticateUser } from "../middlewares/authenticate";

const serverRouter = Router();

serverRouter.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
});

serverRouter.post("/create-server",authenticateUser,createServer)

serverRouter.post("/add-audience",authenticateUser, authenticateOwner, appendAudience)

serverRouter.get("/get-server",authenticateUser,getServers)

export default serverRouter;