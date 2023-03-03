#!/bin/bash
GIT_COMMIT=$1
PACKAGE_NAME=$2
K4_ENV=$3
IMPORT_MAP_AUTH_TOKEN=$4
PACKAGE_PATH=$5

# set up URL_SUFFIC
URL_SUFFIX=$([ $K4_ENV == "PRODUCTION"  ] && echo "" || echo "-${K4_ENV,,}")


curl --location --request PATCH "https://import-map-deployer.k4connect.com/services/?env=${K4_ENV,,}" \
  --header "Authorization: Basic ${IMPORT_MAP_AUTH_TOKEN}" \
  --header "Content-Type: application/json" \
  --data-raw '{
    "service": "@teamhub/'${PACKAGE_NAME}'",
    "url": "https://teamhub'${URL_SUFFIX}'.k4connect.com/'${PACKAGE_PATH}'/'${GIT_COMMIT}'/teamhub-'${PACKAGE_NAME}'.js"
  }'