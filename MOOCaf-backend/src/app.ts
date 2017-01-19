import * as express from "express";
import {join} from "path";
const cfenv = require('cfenv');
const bodyParser = require('body-parser');
const cors = require('cors');

import {json} from "body-parser";
const debug = require('debug')('server:server');
const warn = require('debug')('server:warn');

import mongoose from './models/db';

import {loginRouter} from "./routes/login";
import {courseRouter} from "./routes/course";
import {awardRouter} from "./routes/award";
import { jobRouter } from "./routes/job";
import { userRouter } from "./routes/user";
import { filesRouter } from "./routes/files";

// Init Db access
mongoose.init()
  .catch(err => {
    debug("Starting error... stopping ("+err+")");
    process.exit(-1);
  });


// init webApp
const app: express.Application = express();
app.disable("x-powered-by");

//noinspection TypeScriptValidateTypes
// app.use(favicon(join(__dirname, "public/img", "favicon.png")));
//noinspection TypeScriptValidateTypes
// app.use(express.static(join(__dirname, 'public')));

//noinspection TypeScriptValidateTypes
app.use(bodyParser.urlencoded({extended: true}));
//noinspection TypeScriptValidateTypes
app.use(bodyParser.json());


// cors stuff
let originsWhiteList = ['http://localhost:4200'];
if (process.env['frontend']) {
  originsWhiteList = JSON.parse(process.env['frontend']);
}
//noinspection JSUnusedGlobalSymbols
const corsOptions = {
  origin: function (origin, callback) {
    const isWhitelisted = originsWhiteList.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
};
//noinspection TypeScriptValidateTypes
app.use(cors(corsOptions));

// api routes
//noinspection TypeScriptValidateTypes
app.use("/users", loginRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/course", courseRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/award", awardRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/job", jobRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/user", userRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/files", filesRouter);

// error handlers
// development error handler
// will print stacktrace
//noinspection TypeScriptValidateTypes
if (app.get("env") === "development") {

  //noinspection TypeScriptValidateTypes
  app.use(express.static(join(__dirname, '../../node_modules')));

  //noinspection TypeScriptValidateTypes,JSUnusedLocalSymbols
  app.use(function (err, req: express.Request, res: express.Response, next) {
    res.status(err.status || 500);
    res.json({
      error: err,
      message: err.message
    });
  });
}


//noinspection TypeScriptValidateTypes,JSUnusedLocalSymbols
app.use(function (req: express.Request, res: express.Response, next) {
  res.status(404);

  warn("Error 404 Not found : " + req.url);

  // respond with json
  if (req.accepts('json') || req.accepts('html')) {
    res.send({error: 'Not found : ' + req.url});
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found : ' + req.url);
});


// production error handler
// no stacktrace leaked to user
//noinspection TypeScriptValidateTypes
app.use(function (err: any, req: express.Request, res: express.Response) {
  debug(err);
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export {app}
