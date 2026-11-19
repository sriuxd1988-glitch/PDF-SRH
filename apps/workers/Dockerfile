FROM python:3.11-slim

# Install system utilities, qpdf, and LibreOffice for permissive document conversion
RUN apt-get update && apt-get install -y --no-install-recommends \
    qpdf \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    fonts-liberation \
    fonts-dejavu-core \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

ENV PYTHONUNBUFFERED=1
ENV LIBREOFFICE_CONCURRENCY=1

CMD ["python", "-u", "src/worker.py"]
