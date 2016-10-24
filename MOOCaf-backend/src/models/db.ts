//import * as Mongoose from 'mongoose';
import {DbInitialsData} from "./dbInitialsData";
var Mongoose = require('mongoose');

var debug = require('debug')('server:model:db');

var db = {
  init(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      debug('init...');
      Mongoose.Promise = global.Promise;

      const mongoose = Mongoose.connect("mongodb://127.0.0.1/mydb",
        null,
        error => {
          if (error) {
            debug("Init error 1 : "+error);
            //console.log(error);
            reject(error);
          }
        }
      );


      var db = mongoose.connection;

      db.on('error', function(err) {
        debug("Init error 2 : "+err);
        console.error.bind(console, 'connection error:');
        //this.init()
        //  .catch(reject)
        //reject(err);
      });
      db.on('disconnected', function () {
        console.log('Mongoose default connection to DB disconnected');
      });
      db.once('open', function () {
        debug("Connected to database ");

        DbInitialsData.init();

        resolve
      });
    });


  }

}

export default db


