FROM python:3.10-slim

WORKDIR /app

COPY apps/quantum-service/requirements.txt ./

RUN pip install -r requirements.txt

COPY apps/quantum-service ./apps/quantum-service

WORKDIR /app/apps/quantum-service

EXPOSE 8002

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8002"]