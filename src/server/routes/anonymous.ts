import { Router, Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { secret } from "../config";

const anonymousRouter: Router = Router();

anonymousRouter.get("/", (request: Request, response: Response) => {
    response.json({
        value: "Greetings, don't care about a token.",
        title: "Anonymous call"
    });
});

export { anonymousRouter }





