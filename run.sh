#!/bin/bash

set -e

echo "Cloning the repository..."
git clone https://github.com/Yigao-Zhao/project-assignment-4-group-16.git

echo "Setting up back-end..."
cd project-assignment-4-group-16/back_end
npm install

echo "Starting the back-end server..."
node server.js &  # 后台运行

echo "Setting up front-end..."
cd ../../front_end/laptop-shopping-mall
npm install

echo "Starting the front-end server..."
npm start