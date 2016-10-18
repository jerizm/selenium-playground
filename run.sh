#!/bin/sh

while true; do
  node search.js -i 0
  sleep 5
  node search.js -i 1
  sleep 7200
done
