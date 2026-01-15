#!/bin/bash

# Instalar dependencias del frontend si hay cambios
npm install

# Instalar dependencias del backend si hay cambios
cd backend && npm install

# Iniciar backend en segundo plano
npm start &

# Esperar que backend arranque
sleep 2

# Volver a raíz e iniciar frontend
cd ..
npm run serve
