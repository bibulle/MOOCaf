"use strict";
const express = require("express");
const path_1 = require("path");
var cfenv = require('cfenv');
var bodyParser = require('body-parser');
var cors = require('cors');
var debug = require('debug')('server:server');
var warn = require('debug')('server:warn');
const db_1 = require('./models/db');
const login_1 = require("./routes/login");
const course_1 = require("./routes/course");
const award_1 = require("./routes/award");
// Init Db access
db_1.default.init()
    .catch(err => {
    debug("Starting error... stopping (" + err + ")");
    process.exit(-1);
});
// init webApp
const app = express();
exports.app = app;
app.disable("x-powered-by");
//noinspection TypeScriptValidateTypes
// app.use(favicon(join(__dirname, "public/img", "favicon.png")));
//noinspection TypeScriptValidateTypes
// app.use(express.static(join(__dirname, 'public')));
//noinspection TypeScriptValidateTypes
app.use(bodyParser.urlencoded({ extended: true }));
//noinspection TypeScriptValidateTypes
app.use(bodyParser.json());
// cors stuff
var originsWhiteList = ['http://localhost:4200'];
if (process.env['frontend']) {
    originsWhiteList = JSON.parse(process.env['frontend']);
}
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhiteList.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
};
//noinspection TypeScriptValidateTypes
app.use(cors(corsOptions));
// api routes
//noinspection TypeScriptValidateTypes
app.use("/users", login_1.loginRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/course", course_1.courseRouter);
//noinspection TypeScriptValidateTypes
app.use("/api/award", award_1.awardRouter);
// error handlers
// development error handler
// will print stacktrace
//noinspection TypeScriptValidateTypes
if (app.get("env") === "development") {
    //noinspection TypeScriptValidateTypes
    app.use(express.static(path_1.join(__dirname, '../../node_modules')));
    //noinspection TypeScriptValidateTypes
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });
}
//noinspection TypeScriptValidateTypes
app.use(function (req, res, next) {
    res.status(404);
    warn("Error 404 Not found : " + req.url);
    // respond with json
    if (req.accepts('json') || req.accepts('html')) {
        res.send({ error: 'Not found : ' + req.url });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found : ' + req.url);
});
// production error handler
// no stacktrace leaked to user
//noinspection TypeScriptValidateTypes
app.use(function (err, req, res) {
    debug(err);
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});
//# sourceMappingURL=app.js.map