#!/bin/bash
set -x

# Compress assets with Zopfli
mkdir _site
cd ../
cp -r * _site
