import { Router, Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { secret } from "../config";
import * as jwt from "express-jwt";
var debug = require('debug')('server:protected');


const protectedRouter: Router = Router();

var jwtCheck = jwt({
  secret: "jgjhghjg"
});

protectedRouter.use(jwtCheck);

protectedRouter.get("/random-quote", (request: Request, response: Response) => {
  debug("connected user : "+JSON.stringify(request['user']));
    response.json({
        text: "Greetings, you have valid token.",
        title: "Protected call"
    });
});

export { protectedRouter }





