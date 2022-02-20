#!/bin/bash
set -euxo pipefail

cd .data
if [[ ! -d taiko-web ]]
then
	git clone https://github.com/bui/taiko-web
fi
cd taiko-web
git checkout master
git pull
tools/get_version.sh
cd ../..
cp -r .data/taiko-web/public/src .
