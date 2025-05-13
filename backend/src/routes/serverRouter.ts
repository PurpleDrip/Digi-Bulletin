import { NextFunction, Request, Response, Router } from "express";
import { createServer } from "../controllers/serverController";

const serverRouter = Router();

serverRouter.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
});

serverRouter.post("/create-server",(req:Request,res:Response,next:NextFunction)=>{
    res.locals.ownerId=4;
    next();
},createServer)

export default serverRouter;