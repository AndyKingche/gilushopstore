#!/bin/bash
IP="89.117.72.112"

echo "Building..."
npm run build:ssr

echo "Cleaning server..."
ssh root@$IP "rm -rf /var/www/gilushop/dist/gilustore/browser/* /var/www/gilushop/dist/gilustore/server/*"

echo "Uploading browser files..."
scp dist/gilustore/*.js root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp dist/gilustore/*.css root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp dist/gilustore/*.html root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp dist/gilustore/*.txt root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp dist/gilustore/*.xml root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp -r dist/gilustore/assets root@$IP:/var/www/gilushop/dist/gilustore/browser/
scp dist/gilustore/gilu-favicon.ico root@$IP:/var/www/gilushop/dist/gilustore/browser/

echo "Uploading server files..."
scp -r dist/gilustore/server/* root@$IP:/var/www/gilushop/dist/gilustore/server/

echo "Restarting service..."
ssh root@$IP "systemctl restart gilushop"

echo "Done!"
