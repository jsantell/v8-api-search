#!/bin/sh

deno run --allow-read test/tests.js
ret=$?
if [ $ret -ne 0 ]; then
  echo "FAILED"
fi
exit $ret
