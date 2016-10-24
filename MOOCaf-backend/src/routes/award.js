"use strict";
const express_1 = require("express");
const jwt = require("express-jwt");
const config_1 = require("../config");
const User = require("../models/user");
const award_1 = require("../models/award");
const iAward_1 = require("../models/iAward");
const eStatKey_1 = require("../models/eStatKey");
const awardService_1 = require("../service/awardService");
var debug = require('debug')('server:route:award');
const awardRouter = express_1.Router();
exports.awardRouter = awardRouter;
// Add JWT management
var jwtCheck = jwt({
    secret: config_1.secret
});
//noinspection TypeScriptValidateTypes
awardRouter.use(jwtCheck);
// ====================================
// route to get user awards
// ====================================
awardRouter.route('/')
    .get((request, response) => {
    var userId = request['user']["id"];
    debug("GET /awards");
    //debug("connected user : " + JSON.stringify(request['user']));
    _respondWithAwardsList(userId, response);
})
    .put((request, response) => {
    var userId = request['user']["id"];
    debug("PUT /awards");
    //debug(request.body);
    var award = new award_1.default(request.body);
    //debug(award);
    // TODO : Add a check of user right
    // Save the award
    award_1.default
        .updateOrCreate(award)
        .then(award => {
        //debug(award);
        _respondWithAward(userId, award, response);
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
awardRouter.route('/add')
    .put((request, response) => {
    var userId = request['user']["id"];
    debug("PUT /add");
    //debug(request.body);
    // TODO : Add a check of user right
    // Create a new Award
    let award = new iAward_1.IAward({
        name: "A new award",
        description: "",
        level: 3,
        imgPath: "lock.svg",
        statKey: eStatKey_1.StatKey.COUNT_FINISHED_COURSE,
        limitCount: 0,
        secret: false
    });
    // save it
    award_1.default.updateOrCreate(award)
        .then(() => {
        _respondWithAwardsList(userId, response);
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
awardRouter.route('/:award_id')
    .delete((request, response) => {
    var awardId = request.params.award_id;
    var userId = request['user']["id"];
    debug("DELETE /" + awardId);
    // TODO : Add a check of user right
    // remove it
    award_1.default.remove(awardId)
        .then(() => {
        _respondWithAwardsList(userId, response);
    })
        .catch(err => {
        console.log(err);
        response.status(500).json({ status: 500, message: "System error " + err });
    });
});
function _respondWithAward(userId, award, response) {
    User.findById(userId)
        .then(user => {
        awardService_1.default.fillAwardForUser(award, user)
            .then(completedAward => {
            response.json({ data: completedAward });
        })
            .catch(err => {
            console.log(err);
            response.status(500).send("System error " + err);
        });
    })
        .catch(err => {
        //debug("find catch");
        if (err == "WRONG_USER") {
            response.status(401).send("WRONG_USER");
        }
        else {
            console.log(err);
            response.status(500).send("System error " + err);
        }
    });
}
function _respondWithAwardsList(userId, response) {
    awardService_1.default.getAwards(userId)
        .then(completedAwards => {
        response.json({ data: completedAwards });
    })
        .catch(err => {
        //debug("find catch");
        if (err == "WRONG_USER") {
            response.status(401).send("WRONG_USER");
        }
        else {
            console.log(err);
            response.status(500).send("System error " + err);
        }
    });
}
//# sourceMappingURL=award.js.map