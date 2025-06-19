# ⚡ Screen Reader Backend API

> 🚀 **FastAPI-powered backend service for real-time screen content analysis and OCR processing**

![Backend API Screenshot](https://via.placeholder.com/800x400/0f172a/ffffff?text=FastAPI+Backend+%E2%9A%A1)

[![Live API](https://img.shields.io/badge/🌐_Live_API-Available-brightgreen)](https://screenreader-backend.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://docker.com)

## 🎯 Overview

The Screen Reader Backend is a high-performance FastAPI service that provides RESTful endpoints for screen capture and OCR processing. It integrates the core computer vision library with a modern web API, enabling real-time text extraction from screen content.

## ✨ Features

### 🔍 OCR Processing
- **Dual-Engine Support**: Tesseract OCR + EasyOCR integration
- **Real-time Analysis**: Fast screen capture and text extraction
- **Region-Specific Capture**: Full screen or custom region processing
- **Confidence Scoring**: Reliability metrics for extracted text
- **Bounding Box Detection**: Precise text location mapping

### 🌐 API Capabilities
- **RESTful Endpoints**: Clean, intuitive API design
- **CORS Enabled**: Cross-origin requests supported
- **Health Monitoring**: Built-in health check endpoints
- **Error Handling**: Comprehensive error responses
- **Auto Documentation**: Interactive Swagger/OpenAPI docs

### 🚀 Deployment Features
- **Docker Ready**: Containerized deployment
- **Cloud Optimized**: Render.com configuration
- **Environment Flexible**: Development and production modes
- **Dependency Management**: Poetry-based package management

## 🛠️ API Endpoints

### 📊 Core Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/` | API information | Basic API details |
| `POST` | `/api/capture/screen` | Capture full screen | OCR results with text, confidence, bounding boxes |
| `POST` | `/api/capture/region` | Capture specific region | OCR results for defined area |
| `POST` | `/api/config` | Update OCR settings | Configuration confirmation |
| `GET` | `/api/health` | Health check | Service status |
| `GET` | `/healthz` | Simple health check | OK status |

### 📝 Request/Response Examples

#### Full Screen Capture
```bash
curl -X POST "http://localhost:8000/api/capture/screen" \
     -H "Content-Type: application/json"
```

**Response:**
```json
{
  "text": "Extracted screen text content...",
  "confidence": 85.7,
  "bounding_boxes": [
    {
      "x": 100,
      "y": 50,
      "width": 200,
      "height": 30,
      "text": "Sample text",
      "confidence": 92.3
    }
  ],
  "processing_time": 1.23,
  "engine": "combined",
  "primary_engine": "easyocr",
  "timestamp": 1703123456.789
}
```

#### Region Capture
```bash
curl -X POST "http://localhost:8000/api/capture/region" \
     -H "Content-Type: application/json" \
     -d '{
       "x": 100,
       "y": 100,
       "width": 500,
       "height": 300
     }'
```

#### Configuration Update
```bash
curl -X POST "http://localhost:8000/api/config" \
     -H "Content-Type: application/json" \
     -d '{
       "use_easyocr": true,
       "use_tesseract": false
     }'
```

## 🚀 Quick Start

### 📦 Local Development

```bash
# Navigate to backend directory
cd web-app/screenreader-backend

# Install dependencies with Poetry
poetry install

# Activate virtual environment
poetry shell

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t screenreader-backend .

# Run container
docker run -p 8000:8000 screenreader-backend

# With environment variables
docker run -p 8000:8000 -e PORT=8000 screenreader-backend
```

### ☁️ Cloud Deployment (Render.com)

The backend is configured for automatic deployment on Render.com:

```yaml
# render.yaml configuration included
services:
  - type: web
    name: screenreader-backend
    env: python
    buildCommand: |
      apt-get update && apt-get install -y tesseract-ocr scrot xvfb
      pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 🔧 Configuration

### 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `PYTHON_VERSION` | Python version | `3.12` |

### 🎛️ OCR Engine Configuration

The API supports dynamic OCR engine configuration:

```python
# Available configurations
{
  "use_easyocr": true,    # Enable EasyOCR (higher accuracy)
  "use_tesseract": true   # Enable Tesseract (faster processing)
}
```

**Engine Combinations:**
- **Both Engines** (default): Best accuracy, combined results
- **EasyOCR Only**: Higher accuracy for complex text
- **Tesseract Only**: Faster processing for simple text

## 📁 Project Structure

```
screenreader-backend/
├── 📄 README.md              # This documentation
├── 🐳 Dockerfile             # Container configuration
├── ☁️ render.yaml            # Render.com deployment
├── 📋 pyproject.toml         # Poetry dependencies
├── 📋 requirements.txt       # Pip dependencies
├── 🔧 build.sh              # Build script
├── 📁 app/                   # FastAPI application
│   ├── 🐍 main.py           # API endpoints and configuration
│   └── 📄 __init__.py       # Package initialization
├── 🐍 screen_reader.py       # Core OCR library
└── 🧪 tests/                # Test suite
    └── 📄 __init__.py
```

## 🧪 Testing

### 🔍 Health Check
```bash
curl http://localhost:8000/api/health
```

### 📊 API Documentation
Visit the interactive API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 🧪 Test Suite
```bash
# Run tests
python -m pytest tests/

# Test with coverage
python -m pytest tests/ --cov=app
```

## 🛠️ Dependencies

### 🐍 Core Dependencies
```toml
[tool.poetry.dependencies]
python = "^3.12"
fastapi = {extras = ["standard"], version = "^0.115.13"}
opencv-python = ">=4.10.0.86"
numpy = ">=1.21.0,<2.0"
pillow = ">=8.0.0"
pytesseract = ">=0.3.10"
easyocr = ">=1.7.0,<1.8.0"
```

### 🖥️ System Dependencies
- **Tesseract OCR**: `apt-get install tesseract-ocr`
- **Screen Capture**: `apt-get install scrot xvfb`
- **Python 3.12+**: Required for optimal performance

## 🔧 Development

### 🚀 Development Server
```bash
# Hot reload development
uvicorn app.main:app --reload

# Custom host and port
uvicorn app.main:app --host 0.0.0.0 --port 8080

# Debug mode
uvicorn app.main:app --reload --log-level debug
```

### 🧪 Testing Endpoints
```bash
# Test screen capture
curl -X POST localhost:8000/api/capture/screen

# Test region capture
curl -X POST localhost:8000/api/capture/region \
  -H "Content-Type: application/json" \
  -d '{"x": 0, "y": 0, "width": 800, "height": 600}'

# Test configuration
curl -X POST localhost:8000/api/config \
  -H "Content-Type: application/json" \
  -d '{"use_easyocr": true, "use_tesseract": true}'
```

## 🚨 Troubleshooting

### Common Issues

**🔧 Tesseract Not Found**
```bash
# Ubuntu/Debian
sudo apt-get install tesseract-ocr

# macOS
brew install tesseract
```

**🖥️ Screen Capture Fails**
```bash
# Install screen capture tools
sudo apt-get install scrot xvfb

# For headless environments
export DISPLAY=:99
Xvfb :99 -screen 0 1024x768x24 &
```

**📦 Dependency Conflicts**
```bash
# Use Poetry for dependency management
poetry install

# Or use specific versions
pip install -r requirements.txt
```

## 🌐 Live Demo

🔗 **[API Documentation](https://screenreader-backend.onrender.com/docs)** - Interactive Swagger UI

🔗 **[Health Check](https://screenreader-backend.onrender.com/api/health)** - Service status

## 🔗 Related Components

- **[🏠 Main Project](../../README.md)** - Project overview and setup
- **[🎨 Frontend UI](../screenreader-frontend/README.md)** - React web interface
- **[🐍 Core Library](../../screen_reader.py)** - OCR processing engine

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

<div align="center">

**⚡ Powered by FastAPI and advanced OCR technology**

[📚 API Docs](https://screenreader-backend.onrender.com/docs) • [🐛 Report Issue](https://github.com/raimonvibe/screenreader-computer-vision/issues) • [💡 Request Feature](https://github.com/raimonvibe/screenreader-computer-vision/issues)

</div>
