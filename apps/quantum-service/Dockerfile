FROM python:3.11-slim

WORKDIR /app/apps/quantum-service

# Copiar solo los archivos necesarios para instalar dependencias
COPY requirements.txt .

# Instalar dependencias
RUN pip install -r requirements.txt

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 8002

# Comando para ejecutar la aplicación
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8002", "--reload"] 