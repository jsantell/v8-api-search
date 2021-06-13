#!/bin/bash

rm -rf v8-api-search
mkdir v8-api-search

cp -r src v8-api-search
cp -r web_modules v8-api-search
cp -r assets v8-api-search
cp package.json v8-api-search
cp manifest.json v8-api-search
cp README.md v8-api-search
cp LICENSE v8-api-search

if [ ! -z "$1" ] && [ $1 == 'chrome' ] ;
then
  echo "Building Chrome variation."
  cat manifest.json | \
    json -e 'delete this.browser_specific_settings' > \
    v8-api-search/manifest.json
fi

npx web-ext build \
  --source-dir v8-api-search \
  --artifacts-dir dist \
  --overwrite-dest

rm -r v8-api-search
