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


// Init Db access
mongoose.init()
  .catch(err => {
    debug("Starting error... stopping");
    process.exit(-1);
  });


// init webApp
const app: express.Application = express();
app.disable("x-powered-by");

app.use(favicon(join(__dirname, "public/img", "favicon.png")));
app.use(express.static(join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// api routes
app.use("/1api/random-quote", anonymousRouter);
app.use("/1api/protected", protectedRouter);
app.use("/1api/paragraph", paragraphRouter);
app.use("/1users", loginRouter);

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
  //warn("Error 404 Not found : "+req.baseUrl+" "+req.url);
  res.redirect('/404'+req.originalUrl)
});
app.use('/users',function (req: express.Request, res: express.Response, next) {
  //warn("Error 404 Not found : "+req.baseUrl+" "+req.originalUrl);
  res.redirect('/404'+req.originalUrl)
});
app.use('/404',function (req: express.Request, res: express.Response, next) {

  res.status(404)

  warn("Error 404 Not found : "+req.url);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found : '+req.url });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found : '+req.url);
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
