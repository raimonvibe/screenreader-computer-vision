# Setup Guide

## System Dependencies

Before running the Screen Reader Computer Vision application, you need to install the following system dependencies:

### Required System Packages

```bash
sudo apt-get update
sudo apt-get install -y tesseract-ocr scrot xvfb
```

- **tesseract-ocr**: OCR engine for text recognition
- **scrot**: Screen capture utility
- **xvfb**: Virtual display support

## Python Dependencies

### Core Library
```bash
pip install -r requirements.txt
```

### Backend API
```bash
cd web-app/screenreader-backend
pip install -r requirements.txt
```

## Frontend Dependencies

```bash
cd web-app/screenreader-frontend
npm install
```

## Running the Application

### Python Demo (Console Output)
```bash
python demo.py
```

### Web Application
1. Start the backend server:
```bash
cd web-app/screenreader-backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Start the frontend server:
```bash
cd web-app/screenreader-frontend
npm run dev
```

3. Open http://localhost:5173 in your browser

## Troubleshooting

### Output Window Not Visible
- Ensure all system dependencies are installed
- Check that both backend (port 8000) and frontend (port 5173) servers are running
- Verify the `.env` file in the frontend directory contains `VITE_API_URL=http://localhost:8000`

### Screen Capture Issues
- Install scrot: `sudo apt-get install -y scrot`
- For headless environments, install xvfb: `sudo apt-get install -y xvfb`

### OCR Not Working
- Install Tesseract: `sudo apt-get install -y tesseract-ocr`
- For additional language support: `sudo apt-get install tesseract-ocr-[lang]`
