from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import sys
import os
import cv2
import numpy as np

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

from screen_reader import ScreenReader

app = FastAPI(title="Screen Reader API", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

try:
    screen_reader = ScreenReader(use_easyocr=True, use_tesseract=True)
    print("Initialized with both EasyOCR and Tesseract")
except Exception as e:
    print(f"Failed to initialize with Tesseract, falling back to EasyOCR only: {e}")
    screen_reader = ScreenReader(use_easyocr=True, use_tesseract=False)

class CaptureRequest(BaseModel):
    x: Optional[int] = None
    y: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None

class ConfigRequest(BaseModel):
    use_easyocr: bool = True
    use_tesseract: bool = True

@app.get("/")
def read_root():
    return {"message": "Screen Reader Computer Vision API", "version": "1.0.0"}

@app.post("/api/capture/screen")
async def capture_screen():
    """Capture and read the entire screen."""
    try:
        print("API: Starting screen capture...")
        result = screen_reader.read_screen()
        print(f"API: Screen capture completed, result keys: {result.keys()}")
        print(f"API: Result text length: {len(result.get('text', ''))}")
        print(f"API: Result confidence: {result.get('confidence', 'N/A')}")
        return result
    except Exception as e:
        print(f"API: Error during screen capture: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/capture/region")
async def capture_region(request: CaptureRequest):
    """Capture and read a specific screen region."""
    try:
        if all(v is not None for v in [request.x, request.y, request.width, request.height]):
            x = request.x or 0
            y = request.y or 0  
            width = request.width or 800
            height = request.height or 600
            result = screen_reader.read_region(x, y, width, height)
        else:
            result = screen_reader.read_screen()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/config")
async def update_config(request: ConfigRequest):
    """Update OCR engine configuration."""
    global screen_reader
    try:
        screen_reader = ScreenReader(use_easyocr=request.use_easyocr, use_tesseract=request.use_tesseract)
        return {"message": "Configuration updated", "config": request.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Screen Reader API is running"}

@app.post("/api/upload/image")
async def upload_image(file: UploadFile = File(...)):
    """Upload and process an image file with OCR."""
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        print(f"API: Processing uploaded image: {file.filename}")
        
        contents = await file.read()
        
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Could not decode image file")
        
        result = screen_reader.process_uploaded_image(img)
        
        print(f"API: Image processing completed, result keys: {result.keys()}")
        print(f"API: Result text length: {len(result.get('text', ''))}")
        print(f"API: Result confidence: {result.get('confidence', 'N/A')}")
        
        return result
        
    except Exception as e:
        print(f"API: Error during image upload processing: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
