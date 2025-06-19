# Screen Reading Computer Vision Model

A comprehensive computer vision solution for capturing and reading screen content using OCR and image processing techniques.

## Features

- Real-time screen capture functionality
- Text extraction using multiple OCR engines (Tesseract, EasyOCR)
- UI element detection and analysis
- Support for different screen regions and full screen capture
- Text preprocessing and enhancement for better OCR accuracy
- JSON output with extracted text and bounding boxes

## Dependencies

- OpenCV for image processing
- Tesseract OCR engine
- EasyOCR for advanced text recognition
- PIL/Pillow for image manipulation
- PyAutoGUI for screen capture
- NumPy for numerical operations

## Usage

```python
from screen_reader import ScreenReader

# Initialize the screen reader
reader = ScreenReader()

# Capture and read full screen
result = reader.read_screen()

# Capture specific region
result = reader.read_region(x=100, y=100, width=500, height=300)

# Get structured output
print(result['text'])
print(result['confidence'])
print(result['bounding_boxes'])
```

## Installation

```bash
pip install -r requirements.txt
```

## Testing

```bash
python test_screen_reader.py
```
