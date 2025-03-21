FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/
COPY packages/ ./packages/

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer puertos
EXPOSE 8000
EXPOSE 9228

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev", "--prefix", "apps/api-gateway"] 