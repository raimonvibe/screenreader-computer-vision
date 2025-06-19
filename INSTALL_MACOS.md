# macOS Installation Guide - Screen Reading CV Model

## Prerequisites
- macOS with Python 3.8+ installed
- Homebrew package manager
- Terminal access

## Step-by-Step Installation

### 1. Install System Dependencies
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Tesseract OCR
brew install tesseract

# Verify Tesseract installation
tesseract --version
```

### 2. Create Virtual Environment
```bash
# Navigate to your project directory
cd /path/to/screen_reading_cv_model

# Create virtual environment with python3
python3 -m venv screen_reader_env

# Activate virtual environment
source screen_reader_env/bin/activate

# Upgrade pip to latest version
python3 -m pip install --upgrade pip
```

### 3. Install Python Dependencies

**Option A: Tesseract only (fastest, recommended for most users)**
```bash
python3 -m pip install -r requirements_tesseract_only.txt
```

**Option B: Basic functionality (Tesseract + OpenCV)**
```bash
python3 -m pip install -r requirements_minimal.txt
```

**Option C: Full functionality including EasyOCR (large download ~2GB)**
```bash
python3 -m pip install -r requirements.txt
```

**Option C: Manual installation if conflicts persist**
```bash
# Install core dependencies with compatible versions
python3 -m pip install "numpy>=1.21.0,<2.0"
python3 -m pip install "Pillow>=8.0.0"
python3 -m pip install "opencv-python>=4.10.0.86"

# Install OCR engines
python3 -m pip install "pytesseract>=0.3.10"
python3 -m pip install "easyocr>=1.7.0,<1.8.0"  # This may take 5-10 minutes

# Install remaining dependencies
python3 -m pip install "pyautogui>=0.9.50"
python3 -m pip install "matplotlib>=3.5.0"
```

### 4. Test Installation
```bash
# Run the test suite
python3 test_screen_reader.py

# If tests pass, try the interactive demo
python3 demo.py
```

### 5. Basic Usage
```python
from screen_reader import ScreenReader

# Initialize with both engines (recommended)
reader = ScreenReader(use_easyocr=True, use_tesseract=True)

# Read entire screen
result = reader.read_screen()
print(f"Found text: {result['text']}")

# Read specific region
result = reader.read_region(100, 100, 500, 300)
print(f"Region text: {result['text']}")
```

## Troubleshooting

### If EasyOCR installation fails:
```bash
# Use Tesseract-only mode
reader = ScreenReader(use_easyocr=False, use_tesseract=True)
```

### If you get dependency resolution errors:
```bash
# The requirements files use researched compatible versions:
# - OpenCV >=4.10.0.86 (fixes Python 3.12 setuptools issues)
# - NumPy <2.0 (required for EasyOCR compatibility)
# - EasyOCR 1.7.x (stable with NumPy <2.0)

# Make sure virtual environment is activated
source screen_reader_env/bin/activate

# Try upgrading pip first
python3 -m pip install --upgrade pip

# Use minimal requirements if full requirements fail
python3 -m pip install -r requirements_minimal.txt
```

### If screen capture fails:
- Grant Terminal screen recording permissions in System Preferences > Security & Privacy > Privacy > Screen Recording
- The model will create a test image if screen capture fails

### Performance optimization:
- For speed: Use only Tesseract (`use_easyocr=False`)
- For accuracy: Use only EasyOCR (`use_tesseract=False`)
- For best results: Use both engines (default)

## Deactivating Virtual Environment
```bash
deactivate
```
