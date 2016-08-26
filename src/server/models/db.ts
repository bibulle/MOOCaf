//import * as Mongoose from 'mongoose';
var Mongoose = require('mongoose');

var debug = require('debug')('server:model:db');

var db = {
  init() {
    Mongoose.Promise = global.Promise;

    const mongoose = Mongoose.connect("mongodb://127.0.0.1/mydb",
      null,
      error => {
        if (error) {
          console.log("-1-");
          console.log(error);
        }
      }
    );


    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      debug("Connected to database ");
    });

  }

}

export default db
