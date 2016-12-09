#!/usr/bin/env bash

HOME_PATH=`cd "$(dirname "$0")"; pwd`

cd ${HOME_PATH}
cd MOOCaf-backend
pwd
cf push MOOCaf-backend -b https://github.com/cloudfoundry/nodejs-buildpack.git

cd ${HOME_PATH}
cd MOOCaf-frontend
pwd
ng build --prod
cd dist/
cf push MOOCaf-frontend


