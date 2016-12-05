import { Router, Response, Request } from "express";
import * as jwt from "express-jwt";
import { secret } from "../config";
import JobService from "../service/jobService";
var debug = require('debug')('server:routes:job');
import User = require("../models/user");
import UserChoice = require("../models/userChoice");
import isUndefined = require("lodash/isUndefined");
import IUserCourse = require("../models/UserCourse");
import IUserChoices = require("../models/iUserChoices");
import Paragraph = require("../models/paragraph");
import UserCourse = require("../models/UserCourse");
import IUserPart = require("../models/iUserParts");


const jobRouter: Router = Router();

// Add JWT management
var jwtCheck = jwt({
  secret: secret
});
//noinspection TypeScriptValidateTypes
jobRouter.use(jwtCheck);

// -----------------------------------
// --     /api/job routes     --
// -----------------------------------

jobRouter.route('/:job_id')
            // ====================================
            // route for getting one job
            // ====================================
            .get((request: Request, response: Response) => {
              debug("GET /" + request.params.job_id);
              let jobId = request.params['job_id'];
              //debug("connected user : " + JSON.stringify(request['user']));

              var job = JobService.getJob(jobId);
              if (!job) {
                response.status(404).json({status: 404, message: "Job not found"});
              } else {
                response.json({data: job})
              }

            });


export { jobRouter }





