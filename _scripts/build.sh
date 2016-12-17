#!/bin/bash
set -x

# Compress assets with Zopfli
mkdir _site
ls
TARGETDIR='_site';for file in *;do test "$file" != "$TARGETDIR" && cp -r "$file" "$TARGETDIR/";done
