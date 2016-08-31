#!/bin/bash

sudo rm -rf /Users/njy/Documents/publish/fe/5star_supplier_test/**
sudo fis release -d /Users/njy/Documents/publish/fe/5star_supplier_test
# sudo fis release -o -d /Users/njy/Documents/publish/fe/5star_supplier


cd /Users/njy/Documents/publish/fe/5star_supplier_test

scp -r css  root@43.241.208.237:/root/supplier_test_fte_src
scp -r images  root@43.241.208.237:/root/supplier_test_fte_src
scp -r js  root@43.241.208.237:/root/supplier_test_fte_src
scp -r supplier  root@43.241.208.237:/root/supplier_test_fte_src
scp -r *.html  root@43.241.208.237:/root/supplier_test_fte_src
scp -r WEB-INF  root@43.241.208.237:/root/supplier_test_fte_src

