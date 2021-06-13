#!/bin/bash

rm -rf dist
rm -rf v8-api-search
mkdir v8-api-search
mkdir dist
version=$(cat manifest.json | jq .version | tr -d \")
output_name="v8_api_search-${version}";

echo "Generating $output_name"

cp -r assets v8-api-search
cp -r src v8-api-search
cp -r data v8-api-search
cp manifest.json v8-api-search
cp README.md v8-api-search
cp LICENSE v8-api-search

# Build Firefox
web-ext build \
  --source-dir v8-api-search \
  --artifacts-dir dist
mv "dist/$output_name.zip" "dist/$output_name-firefox.zip"

# Build Chrome 
cat manifest.json | \
  jq 'del(.browser_specific_settings)' > \
  v8-api-search/manifest.json
web-ext build \
  --source-dir v8-api-search \
  --artifacts-dir dist
mv "dist/$output_name.zip" "dist/$output_name-chrome.zip"

rm -rf v8-api-search
