FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed by audio processing and some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app/

# Expose a sensible default port (adjust if your app listens on a different one)
EXPOSE 8010

# Default command - override as needed
CMD ["streamlit", "run", "app.py", "--server.port", "8010", "--server.address", "0.0.0.0", "--server.headless", "true"]
