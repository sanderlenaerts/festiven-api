#!/bin/bash
set -x

# Compress assets with Zopfli
mkdir _site
ls
shopt -s extglob dotglob
mv !(_site) _site
shopt -u dotglob
