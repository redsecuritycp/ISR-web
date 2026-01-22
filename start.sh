#!/bin/bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..

# Build del frontend (genera dist)
npm run build

# Iniciar backend (sirve dist + API)
node backend/server.js
