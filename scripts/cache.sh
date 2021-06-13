#!/bin/sh

deno run --allow-net --allow-read --allow-write scripts/cache-api-summary.js node-16
deno run --allow-net --allow-read --allow-write scripts/cache-api-summary.js node-15
deno run --allow-net --allow-read --allow-write scripts/cache-api-summary.js node-14
deno run --allow-net --allow-read --allow-write scripts/cache-api-summary.js node-12
deno run --allow-net --allow-read --allow-write scripts/cache-api-summary.js node-10
