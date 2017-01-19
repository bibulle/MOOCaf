import { Router, Request, Response } from "express";
import * as jwt from "express-jwt";
import { secret } from "../config";
import UserService from "../service/userService";
import { EditRightType } from "../service/userService";
import { Stats } from "fs";

const UPLOAD_TMP = 'uploads/';
const UPLOAD_FILES = 'files/';

const multer = require('multer');
const upload = multer({ dest: UPLOAD_TMP, limits: { fileSize: 10 * 1024 * 1024 } });

const fs = require('fs');
const path = require('path');

const debug = require('debug')('server:route:files');


const filesRouter: Router = Router();

// Add JWT management
const jwtCheck = jwt({
  secret: secret
});
//noinspection TypeScriptValidateTypes
filesRouter.use(jwtCheck);

// ====================================
// route to upload a file
// ====================================
filesRouter.route('/upload')
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
               const trgPath = path.join(UPLOAD_FILES, courseId, request['file'].originalname);

               fs.mkdir(UPLOAD_FILES, () => {
                 fs.mkdir(path.dirname(trgPath), () => {

                   fs.rename(srcPath, trgPath, (err) => {
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
filesRouter.route('/:course_id')
           .get((request: Request, response: Response) => {
             //debug("connected user : " + JSON.stringify(request['user']));

             const courseId = request.params['course_id'];
             debug("GET /" + courseId);
             const userId = request['user']["id"];

             UserService.checkUserRightAndRespond(userId, EditRightType.EditCourse, courseId, response, () => {

               const filePath = path.join(UPLOAD_FILES, courseId);
               getDirectoriesContent(filePath, "", [])
                 .then(file => {
                   // console.log('======');
                   // console.log(JSON.stringify(file, null, 2));
                   // console.log('======');
                   response.json({data: file})
                 })
                 .catch(err => {
                   console.log(err);
                   response.status(500).send("System error " + err);
                 })


             });
           });


/**
 * Delete tmp file (after download and problems)
 * @param file
 */
function deleteTmpFiles (file) {
  if (file && file.path) {
    setTimeout(
      () => {
        fs.unlink(file.path, () => {
          //console.log('successfully deleted ' + file.path);
        });
      },
      60000
    )
  }
}

function getDirectoriesContent (srcBase: string, srcPath: string, parents: File[]): Promise<File> {

  return new Promise((resolve, reject) => {

    const fullPath = srcBase+"/"+srcPath;

    fs.stat(fullPath, (err, stats) => {

      if (err) {
        return reject(err);
      }

      const file = new File(srcPath, stats);
      if (parents) {
        parents.push(file);
      }
      if (file.isDirectory) {
        const promises = [];

        fs.readdir(fullPath, (err, files) => {
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


class File {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  date: Date;
  children: File[];

  constructor (filePath: string, stat: Stats) {
    this.path = filePath;
    this.name = path.basename(filePath);
    this.isDirectory = stat.isDirectory();
    this.size = stat.size;
    this.date = stat.ctime;

    if (this.isDirectory) {
      this.children = [];
      delete this.size;
    }
  }
}
export { filesRouter }
