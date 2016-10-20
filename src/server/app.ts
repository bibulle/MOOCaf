/// <reference path="../../typings/index.d.ts" />
import * as express from "express";
import {join} from "path";
import * as favicon from "serve-favicon";
var bodyParser = require('body-parser');
var cors = require('cors');

import {json} from "body-parser";
var debug = require('debug')('server:server');
var warn = require('debug')('server:warn');

import mongoose from './models/db';

import {loginRouter} from "./routes/login";
import {courseRouter} from "./routes/course";
import {awardRouter} from "./routes/award";


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
app.use(favicon(join(__dirname, "public/img", "favicon.png")));
//noinspection TypeScriptValidateTypes
app.use(express.static(join(__dirname, 'public')));

//noinspection TypeScriptValidateTypes
app.use(bodyParser.urlencoded({extended: true}));
//noinspection TypeScriptValidateTypes
app.use(bodyParser.json());

// cors stuff
var originsWhitelist = [
  'http://localhost:4200',      //this is my front-end url for development
  'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function(origin, callback){
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials:true
}
//noinspection TypeScriptValidateTypes
app.use(cors(corsOptions));

// api routes
//noinspection TypeScriptValidateTypes
app.use("/users", loginRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/course", courseRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/award", awardRouter);

//app.use('/client', express.static(join(__dirname, '../client')));

// error handlers
// development error handler
// will print stacktrace
//noinspection TypeScriptValidateTypes
if (app.get("env") === "development") {

  //noinspection TypeScriptValidateTypes
  app.use(express.static(join(__dirname, '../../node_modules')));

  //noinspection TypeScriptValidateTypes
  app.use(function (err, req: express.Request, res: express.Response, next) {
    res.status(err.status || 500);
    res.json({
      error: err,
      message: err.message
    });
  });
}

// wrong /api => 404
//noinspection TypeScriptValidateTypes
app.use('/api', function (req: express.Request, res: express.Response) {
  //warn("Error 404 Not found : "+req.baseUrl+" "+req.url);
  res.redirect('/404' + req.originalUrl)
});
//noinspection TypeScriptValidateTypes
app.use('/users', function (req: express.Request, res: express.Response) {
  //warn("Error 404 Not found : "+req.baseUrl+" "+req.originalUrl);
  res.redirect('/404' + req.originalUrl)
});
//noinspection TypeScriptValidateTypes
app.use('/404', function (req: express.Request, res: express.Response, next) {
  res.status(404);

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
app.use(function (req: express.Request, res: express.Response) {
  res.status(200).sendFile(join(join(__dirname, 'public', 'index.html')));
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
