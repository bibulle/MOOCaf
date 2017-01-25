//import * as Mongoose from 'mongoose';
import { DbInitialsData } from "./dbInitialsData";
const Mongoose = require('mongoose');
const cfenv = require('cfenv');
const _fs = require('fs');
const _path = require('path');
const async = require('async');

const Grid = require('gridfs-stream');
Grid.mongo = Mongoose.mongo;

const debug = require('debug')('server:model:db');

let gfs;

const db = {

  init(): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      debug('init...');
      Mongoose.Promise = global.Promise;

      const appEnv = cfenv.getAppEnv();
      let mongoLabUrl = appEnv.getServiceURL('MOOCERer-database');
      if (mongoLabUrl == null) {
        //local or prod development
        mongoLabUrl = 'mongodb://localhost/MOOCer';
      }
      debug('        connection to : ' + mongoLabUrl);

      const mongoose = Mongoose.connect(mongoLabUrl,
        null,
        error => {
          if (error) {
            debug("Init error 1 : " + error);
            //console.log(error);
            reject(error);
          }
        }
      );


      const conn = mongoose.connection;

      conn.on('error', function (err) {
        debug("Init error 2 : " + err);
        console.error.bind(console, 'connection error:');
        //this.init()
        //  .catch(reject)
        //reject(err);
      });
      conn.on('disconnected', function () {
        console.log('Mongoose default connection to DB disconnected');
      });
      conn.once('open', function () {
        debug("Connected to database ");

        DbInitialsData.init();

        gfs = Grid(conn.db);

        // create files from Db
        gfs.files.find({}).toArray(function (err, files) {
          if (err) {
            return reject(err);
          }
          //console.log(files);

          async.eachOfSeries(
            files,
            (file: any, key, callback) => {
              // if not exist, read it
              if (!_fs.existsSync(file.filename)) {

                //write content to file system
                my_mkdir(_path.dirname(file.filename));
                const fs_write_stream = _fs.createWriteStream(file.filename, { flags: 'w', autoClose: true });
                debug(`Need to create : ${fs_write_stream.path}`);

                //read from mongodb
                const readStream = gfs.createReadStream({
                  filename: file.filename
                });
                readStream.pipe(fs_write_stream);
                fs_write_stream.on('close', function () {
                  debug('   done');
                  callback();
                });
                fs_write_stream.on('error', function (err) {
                  callback(err);
                });
              }

            },
            (err) => {
              if (err) {
                debug(err);
                return reject(err);
              }

              resolve();
            }
          );
        });
      });
    });


  },

  saveFile(filename: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      // remove if exist
      gfs.remove({ filename: filename }, (err) => {
        if (err) {
          debug(err);
          return reject(err);
        }

        const writeStream = gfs.createWriteStream({ filename: filename });
        _fs.createReadStream(filename).pipe(writeStream);

        writeStream.on('close', function (file) {
          // do something with `file`
          debug(file.filename + 'Written To DB');
          resolve();
        });
        writeStream.on('error', function (err) {
          debug('Error ' + err);
          reject();
        });

      });
    });


  },

  deleteFile(filename: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      // remove if exist
      gfs.remove({ filename: filename }, (err) => {
        if (err) {
          debug(err);
          return reject(err);
        }

        resolve();

      });
    });


  }

};

export default db


function my_mkdir (path: string) {
  if ((_path.dirname(path) != '/') && (_path.dirname(path) != ".")) {
    my_mkdir(_path.dirname(path));
  }
  try {
    _fs.mkdirSync(path);
  } catch (e) {
    if (e.code != 'EEXIST') {
      throw e;
    }
  }
}