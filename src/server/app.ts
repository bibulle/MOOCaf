/// <reference path="../../typings/index.d.ts" />
import * as express from "express";
import {join} from "path";
import * as favicon from "serve-favicon";
var bodyParser = require('body-parser');

import {json, urlencoded} from "body-parser";
var debug = require('debug')('server:server');
var warn = require('debug')('server:warn');

import mongoose from './models/db';
import {loginRouter} from "./routes/login";
import {protectedRouter} from "./routes/protected";
import {anonymousRouter} from "./routes/anonymous";
import {paragraphRouter} from "./routes/paragraph";
import {courseRouter} from "./routes/course";


// Init Db access
mongoose.init()
  .catch(err => {
    debug("Starting error... stopping");
    process.exit(-1);
  });


// init webApp
const app: express.Application = express();
app.disable("x-powered-by");

//noinspection TypeScriptValidateTypes
app.use(favicon(join(__dirname, "public/img", "favicon.png")));
//noinspection TypeScriptValidateTypes
app.use(express.static(join(__dirname, 'public')));

//noinspection TypeScriptValidateTypes
app.use(bodyParser.urlencoded({extended: true}));
//noinspection TypeScriptValidateTypes
app.use(bodyParser.json());

// api routes
//noinspection TypeScriptValidateTypes
app.use("/api/random-quote", anonymousRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/protected", protectedRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/paragraph", paragraphRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/course", courseRouter);
//noinspection TypeScriptValidateTypes
app.use("/users", loginRouter);

//app.use('/client', express.static(join(__dirname, '../client')));

// error handlers
// development error handler
// will print stacktrace
//noinspection TypeScriptValidateTypes
if (app.get("env") === "development") {

  //noinspection TypeScriptValidateTypes
  app.use(express.static(join(__dirname, '../../node_modules')));

  //noinspection TypeScriptValidateTypes
  app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
      error: err,
      message: err.message
    });
  });
}

// wrong /api => 404
//noinspection TypeScriptValidateTypes
app.use('/api', function (req: express.Request, res: express.Response, next) {
  //warn("Error 404 Not found : "+req.baseUrl+" "+req.url);
  res.redirect('/404' + req.originalUrl)
});
//noinspection TypeScriptValidateTypes
app.use('/users', function (req: express.Request, res: express.Response, next) {
  //warn("Error 404 Not found : "+req.baseUrl+" "+req.originalUrl);
  res.redirect('/404' + req.originalUrl)
});
//noinspection TypeScriptValidateTypes
app.use('/404', function (req: express.Request, res: express.Response, next) {

  res.status(404)

  warn("Error 404 Not found : " + req.url);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', {url: req.url});
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({error: 'Not found : ' + req.url});
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found : ' + req.url);
});


// other foward to angular
//noinspection TypeScriptValidateTypes
app.use(function (req: express.Request, res: express.Response, next) {
  res.status(200).sendFile(join(join(__dirname, 'public', 'index.html')));
});

// production error handler
// no stacktrace leaked to user
//noinspection TypeScriptValidateTypes
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  debug(err);
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message
  });
});

export {app}
