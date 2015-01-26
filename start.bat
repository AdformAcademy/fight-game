@echo off
start cmd /k "cd tests/ && karma start"
start cmd /k "echo Npm installer && npm install && echo Launching server... && nodemon"