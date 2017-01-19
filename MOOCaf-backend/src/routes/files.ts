import { Router, Request, Response } from "express";
import * as jwt from "express-jwt";
import { secret } from "../config";

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


export { filesRouter }
