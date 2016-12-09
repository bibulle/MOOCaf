#!/usr/bin/env bash

cd `dirname $0`
#cd MOOCaf-backend
#cf push MOOCaf-backend -b https://github.com/cloudfoundry/nodejs-buildpack.git

cd `dirname $0`
cd MOOCaf-frontend
ng build --prod
cd dist/
cf push MOOCaf-frontend


