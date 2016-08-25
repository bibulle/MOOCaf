/// <reference path="../../typings/index.d.ts" />
import * as express from "express";
import {join} from "path";
import * as favicon from "serve-favicon";
import {json, urlencoded} from "body-parser";
var debug = require('debug')('server:server');

import {loginRouter} from "./routes/login";
import {protectedRouter} from "./routes/protected";
import {anonymousRouter} from "./routes/anonymous";
import {paragraphRouter} from "./routes/paragraph";


const app: express.Application = express();
app.disable("x-powered-by");

app.use(favicon(join(__dirname, "public", "favicon.png")));
app.use(express.static(join(__dirname, 'public')));

app.use(json());
app.use(urlencoded({extended: true}));

// api routes
app.use("/api/random-quote", anonymousRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/paragraph", paragraphRouter);
app.use("/users", loginRouter);

//app.use('/client', express.static(join(__dirname, '../client')));

// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {

  app.use(express.static(join(__dirname, '../../node_modules')));

  app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
      error: err,
      message: err.message
    });
  });
}

// wrong /api => 404
app.use('/api',function (req: express.Request, res: express.Response, next) {
  res.status(404).json({error: 404, message: "Api not found : "+req.url});
});


// other foward to angular
app.use(function (req: express.Request, res: express.Response, next) {
  res.status(200).sendFile(join(join(__dirname, 'public', 'index.html')));
});

// production error handler
// no stacktrace leaked to user
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  debug(err);
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export {app}
