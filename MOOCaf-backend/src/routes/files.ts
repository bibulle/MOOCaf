import { Router, Request, Response } from "express";
import * as jwt from "express-jwt";
import { secret } from "../config";
import UserService from "../service/userService";
import { EditRightType } from "../service/userService";
import { Stats } from "fs";
import { unescape } from "querystring";

const UPLOAD_TMP = 'uploads/';
const UPLOAD_FILES = 'files/';

const multer = require('multer');
const upload = multer({ dest: UPLOAD_TMP, limits: { fileSize: 10 * 1024 * 1024 } });

const _fs = require('fs');
const _path = require('path');

const debug = require('debug')('server:route:files');


const filesApiRouter: Router = Router();
const fileRouter: Router = Router();

// Add JWT management
const jwtCheck = jwt({
  secret: secret
});
//noinspection TypeScriptValidateTypes
filesApiRouter.use(jwtCheck);

// ====================================
// route to upload a file
// ====================================
filesApiRouter.route('/upload')
              .post(upload.single('file'), (request: Request, response: Response) => {

                try {


                  //const userId = request['user']["id"];

                  debug("POST /upload");

                  const courseId = request.body['courseId'];

                  //console.log(request['file']);

                  if (!courseId) {
                    return response.status(400).send('Bad request');
                  }

                  const file = request['file'];
                  const srcPath = request['file'].path;
                  const trgPath = _path.join(UPLOAD_FILES, courseId, request['file'].originalname);

                  _fs.mkdir(UPLOAD_FILES, () => {
                    _fs.mkdir(_path.dirname(trgPath), () => {

                      _fs.rename(srcPath, trgPath, (err) => {
                        if (err) {
                          console.log(err);
                          response.status(500).send(err);
                        } else {
                          setTimeout(
                            () => {
                              response.status(200).send("OK");
                            },
                            0
                          )
                        }
                      });
                    });
                  });

                } catch (e) {
                  console.log(e);
                  response.status(500).send(e.message);
                } finally {
                  deleteTmpFiles(request['file']);
                }


              });

// ====================================
// route to get file list
// ====================================
filesApiRouter.route('/:course_id')
              .get((request: Request, response: Response) => {
                //debug("connected user : " + JSON.stringify(request['user']));

                const courseId = request.params['course_id'];
                debug("GET /" + courseId);
                const userId = request['user']["id"];

                UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                  const filePath = _path.join(UPLOAD_FILES, courseId);
                  getDirectoriesContent(filePath, "", [])
                    .then(file => {
                      // console.log('======');
                      // console.log(JSON.stringify(file, null, 2));
                      // console.log('======');
                      response.json({ data: file })
                    })
                    .catch(err => {
                      console.log(err);
                      response.status(500).send("System error " + err);
                    })


                });
              });

// ====================================
// route to get file list
// ====================================
filesApiRouter.route('/:course_id/*')
              .delete((request: Request, response: Response) => {

                const courseId = request.params['course_id'];
                const path = unescape(request.path.substring(request.path.indexOf('/', 1)));
                debug("DELETE /" + courseId + path);
                const userId = request['user']["id"];

                UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

                  const filePath = _path.join(UPLOAD_FILES, courseId, path);

                  deleteRecursive(filePath)
                    .then(() => {
                      response.json({ data: "" })
                    })
                    .catch(err => {
                      response.status(500).send("System error " + err);
                    });


                });

              });


// ====================================
// route to get a file
// ====================================
fileRouter.route('/:course_id/*')
          .get((request: Request, response: Response) => {

            const courseId = request.params['course_id'];
            const path = unescape(request.path.substring(request.path.indexOf('/', 1)+1));
            debug("GET /" + courseId + "/"+path);

            const basePath1 = _path.resolve(UPLOAD_FILES);
            const basePath2 = _path.resolve(UPLOAD_FILES, courseId);
            const filePath = _path.resolve(UPLOAD_FILES, courseId+'/', path);


            debug(basePath1);
            debug(basePath2);
            debug(filePath);

            // test to avoid moving along
            if (basePath2.startsWith(basePath1+'/') && filePath.startsWith(basePath2+'/')) {
              debug("sending "+filePath);
              response.sendFile(filePath);
            } else {
              debug("error "+filePath);
              response.status(404).json({ status: 500, message: "Not found." });
            }



          });


/**
 * Delete tmp file (after download and problems)
 * @param file
 */
function deleteTmpFiles (file) {
  if (file && file.path) {
    setTimeout(
      () => {
        _fs.unlink(file.path, () => {
          //console.log('successfully deleted ' + file.path);
        });
      },
      60000
    )
  }
}

function getDirectoriesContent (srcBase: string, srcPath: string, parents: File[]): Promise<File> {

  return new Promise((resolve, reject) => {

    const fullPath = srcBase + "/" + srcPath;

    _fs.stat(fullPath, (err, stats) => {

      if (err) {
        if (err.code == 'ENOENT') {
          return resolve(new File(srcPath, null))
        } else {
          return reject(err);
        }
      }

      const file = new File(srcPath, stats);
      if (parents) {
        parents.push(file);
      }
      if (file.isDirectory) {
        const promises = [];

        _fs.readdir(fullPath, (err, files) => {
          if (err) {
            return reject(err);
          }
          files.forEach(f => {
            promises.push(getDirectoriesContent(srcBase, srcPath + "/" + f, file.children));
          });

          Promise.all(promises)
                 .then(() => {
                   resolve(file);
                 })
                 .catch(err => {
                   reject(err);
                 })
        })
      } else {
        resolve(file);
      }

    });
  });
}

function deleteRecursive (path: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {

    _fs.stat(path, (err, stats) => {
      if (err) {
        if (err.code == 'ENOENT') {
          return resolve()
        } else {
          return reject(err);
        }
      }

      if (stats.isDirectory()) {
        const promises = [];
        _fs.readdir(path, (err, files) => {
          if (err) {
            return reject(err);
          }
          files.forEach(f => {
            promises.push(deleteRecursive(path + "/" + f));
          });

          Promise.all(promises)
                 .then(() => {
                   _fs.rmdir(path, (err) => {
                     if (err && (err.code != 'ENOENT')) {
                       return reject(err);
                     } else {
                       return resolve()
                     }
                   })
                 })
                 .catch(err => {
                   reject(err);
                 })
        })
      } else {
        _fs.unlink(path);
        resolve();
      }
    });

  })
}


class File {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  date: Date;
  children: File[];

  constructor (filePath: string, stat: Stats) {
    this.path = filePath;
    this.name = _path.basename(filePath);
    if (stat) {
      this.isDirectory = stat.isDirectory();
      this.size = stat.size;
      this.date = stat.ctime;

      if (this.isDirectory) {
        this.children = [];
        delete this.size;
      }
    }
  }
}

export { filesApiRouter, fileRouter }
