#!/usr/bin/env bash

if [ $# -ne 1 ]
then
   echo "+++"
   echo "+++ Usage : $0 <mongoDb host>"
   echo "+++"
   exit -1
fi
HOST=$1

MONGOEXPORT=~/Documents/mongodb/bin/mongoexport

SAVE_PATH=saves/`date +%Y_%m_%d`

mkdir ${SAVE_PATH} 2>/dev/null

for col in awards courses usercourses users userstats fs.chunks fs.files
do
  ${MONGOEXPORT} --host ${HOST} --db MOOCer --collection ${col} --out ${SAVE_PATH}/${col}.json
done

