#!/bin/bash
pkill -9 -f "node backend/server.js" 2>/dev/null
sleep 1
node backend/server.js
