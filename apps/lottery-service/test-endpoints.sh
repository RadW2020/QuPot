#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Iniciando pruebas de endpoints..."

# 1. Crear un nuevo sorteo
echo -e "\n${GREEN}1. Creando nuevo sorteo...${NC}"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:8003/lottery \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sorteo de Prueba",
    "description": "Sorteo para probar los endpoints",
    "startDate": "2024-03-20T00:00:00Z",
    "endDate": "2024-03-21T00:00:00Z",
    "status": "PENDING"
  }')

# Extraer el ID del sorteo creado
DRAW_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$DRAW_ID" ]; then
  echo -e "${RED}❌ Error al crear el sorteo${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Sorteo creado con ID: $DRAW_ID${NC}"

# 2. Obtener todos los sorteos
echo -e "\n${GREEN}2. Obteniendo todos los sorteos...${NC}"
curl -s -X GET http://localhost:8003/lottery | jq '.'

# 3. Obtener un sorteo específico
echo -e "\n${GREEN}3. Obteniendo sorteo específico...${NC}"
curl -s -X GET http://localhost:8003/lottery/$DRAW_ID | jq '.'

# 4. Actualizar un sorteo
echo -e "\n${GREEN}4. Actualizando sorteo...${NC}"
curl -s -X PATCH http://localhost:8003/lottery/$DRAW_ID \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Sorteo actualizado para pruebas"
  }' | jq '.'

# 5. Iniciar el sorteo
echo -e "\n${GREEN}5. Iniciando sorteo...${NC}"
curl -s -X POST http://localhost:8003/lottery/$DRAW_ID/start | jq '.'

# 6. Completar el sorteo
echo -e "\n${GREEN}6. Completando sorteo...${NC}"
curl -s -X POST http://localhost:8003/lottery/$DRAW_ID/complete \
  -H "Content-Type: application/json" \
  -d '{
    "winningNumbers": [1, 2, 3, 4, 5, 6]
  }' | jq '.'

# 7. Cancelar el sorteo (esto fallará porque ya está completado)
echo -e "\n${GREEN}7. Intentando cancelar sorteo completado...${NC}"
curl -s -X POST http://localhost:8003/lottery/$DRAW_ID/cancel | jq '.'

# 8. Eliminar el sorteo
echo -e "\n${GREEN}8. Eliminando sorteo...${NC}"
curl -s -X DELETE http://localhost:8003/lottery/$DRAW_ID

# Verificar que el sorteo fue eliminado
echo -e "\n${GREEN}9. Verificando que el sorteo fue eliminado...${NC}"
curl -s -X GET http://localhost:8003/lottery/$DRAW_ID | jq '.'

echo -e "\n${GREEN}✅ Pruebas completadas${NC}" 