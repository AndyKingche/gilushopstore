#!/bin/bash
IP="89.117.72.112"
PORT=2200

echo "Building..."
npm run build:ssr

echo "Cleaning server..."
ssh -p $PORT root@$IP "rm -rf /var/www/gilushop/dist/gilustore/browser/* /var/www/gilushop/dist/gilustore/server/*"

echo "Uploading browser files..."
scp -P $PORT dist/gilustore/*.js root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp -P $PORT dist/gilustore/*.css root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp -P $PORT dist/gilustore/*.html root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp -P $PORT dist/gilustore/*.txt root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp -P $PORT -r dist/gilustore/assets root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp -P $PORT dist/gilustore/gilu-favicon.ico root@$IP:/var/www/gilushop/dist/gilustore/browser/

echo "Uploading server files..."
scp -P $PORT -r dist/gilustore/server/* root@$IP:/var/www/gilushop/dist/gilustore/server/

echo "Restarting service..."
ssh -p $PORT root@$IP "systemctl restart gilushop"

echo "Done!"