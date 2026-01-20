#!/bin/bash

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..

# Iniciar backend en segundo plano
node backend/server.js &

# Esperar que backend arranque
sleep 3

# Iniciar frontend
npm run serve
