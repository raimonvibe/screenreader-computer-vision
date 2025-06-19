#!/bin/bash

echo "Starting build process..."

echo "Attempting to install system dependencies..."
apt-get update && apt-get install -y tesseract-ocr scrot xvfb || {
    echo "System package installation failed - using fallback approach"
    
    echo "Attempting manual tesseract installation..."
    
    mkdir -p /app/bin
    
    echo "System dependencies unavailable - OCR will use EasyOCR only"
}

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Build process completed"
