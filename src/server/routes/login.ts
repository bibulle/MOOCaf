import {Router, Request, Response, NextFunction} from "express";
import {randomBytes, pbkdf2} from "crypto";
import {sign} from "jsonwebtoken";
import {secret, length} from "../config";
import * as _ from 'lodash';

var debug = require('debug')('server:route:login');


const loginRouter: Router = Router();

var users: {}[] = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];
/*
const user = {
  hashedPassword: "5d4c532497ee5153fc17c7a016bd2e7e0723664ba0daa7d47005773c7a39ae2c8b3526c131ebeaf55e2911ddbfbe9e582f91059f208f78c22885d0fa045f595d917338b3cf98f6722552682b1c8814d60293ec6bf46c8ef3c7759b4c7a262d1ffc347264af8ac072fb2dea776827cd4b98ed3d1e35eba17687f5d4b212d4c093",
  salt: "/9R9UFYuH4aZ8Q9mwgC/gbA+ejy32uUEUWMS6BpSKuq3k+xJTRS053TBIgqRvcvRkOPJhm98lVKf0t7cvglpf1F3kY9LL2xJxG/m5LsD4ydlI/PJPzaXcYoAwjrD20uTa7WIB3syCXgR+POshmTlIgHf+txf2bCx5OJsHpiyLy0=",
  username: "john"
};
*/

function createToken(user) {
  return sign(_.omit(user, 'password'), "jgjhghjg", { expiresIn: "7d" });
}

loginRouter.post('/', function(request: Request, response: Response, next: NextFunction) {
  if (!request.body.username || !request.body.password) {
    debug("400 : You must send the username and the password");
    return response.status(400).send("You must send the username and the password");
  }
  if (_.find(users, {username: request.body.username})) {
    debug("400 : A user with that username already exists");
    return response.status(400).send("A user with that username already exists");
  }

  var profile = _.pick(request.body, 'username', 'password', 'extra');
  profile['id'] = _.maxBy(users, 'id')['id'] + 1;

  users.push(profile);
  debug("201 : user created("+request.body.username+")");

  response.status(201).send({
    id_token: createToken(profile)
  });
});

loginRouter.post('/create', function(request: Request, response: Response, next: NextFunction) {
  if (!request.body.username || !request.body.password) {
    debug("400 : You must send the username and the password");
    return response.status(400).send("You must send the username and the password");
  }

  var user = _.find(users, {username: request.body.username});
  if (!user) {
    debug("401 : The username or password don't match");
    return response.status(401).send("The username or password don't match");
  }

  if (!(user['password'] === request.body.password)) {
    debug("401 : The username or password don't match");
    return response.status(401).send("The username or password don't match");
  }

  debug("201 : token created("+request.body.username+")");
  response.status(201).send({
    id_token: createToken(user)
  });
});

export {loginRouter}
