
@echo off
echo Installing dependencies...
call npm install

echo Starting server...
node start-mongo-server.js
