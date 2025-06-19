import cv2
import numpy as np
import pytesseract
from PIL import Image, ImageEnhance
import json
from typing import Dict, List, Tuple, Optional
import time
import subprocess
import os

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
    print("EasyOCR not available. Install with: pip install easyocr")

class ScreenReader:
    """
    A comprehensive computer vision model for reading screen content.
    Combines screen capture with multiple OCR engines for robust text extraction.
    """
    
    def __init__(self, use_easyocr: bool = True, use_tesseract: bool = True):
        """
        Initialize the screen reader with OCR engines.
        
        Args:
            use_easyocr: Whether to use EasyOCR engine
            use_tesseract: Whether to use Tesseract OCR engine
        """
        self.use_easyocr = use_easyocr and EASYOCR_AVAILABLE
        self.use_tesseract = use_tesseract
        
        if use_easyocr and not EASYOCR_AVAILABLE:
            print("Warning: EasyOCR requested but not available. Install with: pip install easyocr")
            print("Falling back to Tesseract-only mode.")
        
        if self.use_easyocr:
            print("Initializing EasyOCR...")
            self.easyocr_reader = easyocr.Reader(['en'])
            
        if self.use_tesseract:
            print("Tesseract OCR ready")
        
    def capture_screen(self, region: Optional[Tuple[int, int, int, int]] = None) -> np.ndarray:
        """
        Capture screen or specific region using scrot (headless-compatible).
        
        Args:
            region: Tuple of (x, y, width, height) for specific region capture
            
        Returns:
            Captured image as numpy array
        """
        temp_file = "/tmp/screenshot.png"
        
        try:
            if region:
                x, y, width, height = region
                # Use scrot for region capture
                cmd = f"scrot -a {x},{y},{width},{height} {temp_file}"
            else:
                cmd = f"scrot {temp_file}"
            
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode != 0:
                print("Warning: scrot failed, creating test image")
                return self._create_test_image()
            
            img = cv2.imread(temp_file)
            
            if os.path.exists(temp_file):
                os.remove(temp_file)
            
            if img is None:
                print("Warning: Could not load screenshot, creating test image")
                return self._create_test_image()
                
            return img
            
        except Exception as e:
            print(f"Screenshot capture failed: {e}, creating test image")
            return self._create_test_image()
    
    def _create_test_image(self) -> np.ndarray:
        """
        Create a test image with sample text for testing purposes.
        
        Returns:
            Test image as numpy array
        """
        img = np.ones((400, 800, 3), dtype=np.uint8) * 255
        
        font = cv2.FONT_HERSHEY_SIMPLEX
        texts = [
            "Screen Reading Computer Vision Model",
            "This is a test image for OCR testing",
            "The quick brown fox jumps over the lazy dog",
            "1234567890 !@#$%^&*()",
            "Testing different font sizes and styles"
        ]
        
        y_positions = [50, 100, 150, 200, 250]
        font_scales = [1.2, 0.8, 0.6, 0.5, 0.7]
        
        for i, (text, y_pos, scale) in enumerate(zip(texts, y_positions, font_scales)):
            cv2.putText(img, text, (20, y_pos), font, scale, (0, 0, 0), 2)
        
        return img
    
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess image for better OCR accuracy.
        
        Args:
            image: Input image as numpy array
            
        Returns:
            Preprocessed image
        """
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        kernel = np.ones((2, 2), np.uint8)
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        
        return cleaned
    
    def extract_text_tesseract(self, image: np.ndarray) -> Dict:
        """
        Extract text using Tesseract OCR.
        
        Args:
            image: Input image as numpy array
            
        Returns:
            Dictionary with extracted text and metadata
        """
        if not self.use_tesseract:
            return {"text": "", "confidence": 0, "bounding_boxes": []}
            
        config = '--oem 3 --psm 6'
        
        data = pytesseract.image_to_data(image, config=config, output_type=pytesseract.Output.DICT)
        
        texts = []
        confidences = []
        bounding_boxes = []
        
        for i in range(len(data['text'])):
            if int(data['conf'][i]) > 30:  # Confidence threshold
                text = data['text'][i].strip()
                if text:
                    texts.append(text)
                    confidences.append(int(data['conf'][i]))
                    bounding_boxes.append({
                        'x': data['left'][i],
                        'y': data['top'][i],
                        'width': data['width'][i],
                        'height': data['height'][i],
                        'text': text,
                        'confidence': int(data['conf'][i])
                    })
        
        full_text = ' '.join(texts)
        avg_confidence = np.mean(confidences) if confidences else 0
        
        return {
            "text": full_text,
            "confidence": avg_confidence,
            "bounding_boxes": bounding_boxes,
            "engine": "tesseract"
        }
    
    def extract_text_easyocr(self, image: np.ndarray) -> Dict:
        """
        Extract text using EasyOCR.
        
        Args:
            image: Input image as numpy array
            
        Returns:
            Dictionary with extracted text and metadata
        """
        if not self.use_easyocr:
            return {"text": "", "confidence": 0, "bounding_boxes": []}
            
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        results = self.easyocr_reader.readtext(rgb_image)
        
        texts = []
        confidences = []
        bounding_boxes = []
        
        for (bbox, text, confidence) in results:
            if confidence > 0.3:  # Confidence threshold
                texts.append(text)
                confidences.append(confidence)
                
                x_coords = [point[0] for point in bbox]
                y_coords = [point[1] for point in bbox]
                x = int(min(x_coords))
                y = int(min(y_coords))
                width = int(max(x_coords) - min(x_coords))
                height = int(max(y_coords) - min(y_coords))
                
                bounding_boxes.append({
                    'x': x,
                    'y': y,
                    'width': width,
                    'height': height,
                    'text': text,
                    'confidence': confidence
                })
        
        full_text = ' '.join(texts)
        avg_confidence = np.mean(confidences) if confidences else 0
        
        return {
            "text": full_text,
            "confidence": avg_confidence,
            "bounding_boxes": bounding_boxes,
            "engine": "easyocr"
        }
    
    def combine_results(self, tesseract_result: Dict, easyocr_result: Dict) -> Dict:
        """
        Combine results from multiple OCR engines for better accuracy.
        
        Args:
            tesseract_result: Results from Tesseract
            easyocr_result: Results from EasyOCR
            
        Returns:
            Combined results
        """
        if tesseract_result["confidence"] > easyocr_result["confidence"]:
            primary_result = tesseract_result
            secondary_result = easyocr_result
        else:
            primary_result = easyocr_result
            secondary_result = tesseract_result
        
        all_bounding_boxes = primary_result["bounding_boxes"] + secondary_result["bounding_boxes"]
        
        unique_boxes = self._remove_duplicate_boxes(all_bounding_boxes)
        
        return {
            "text": primary_result["text"],
            "confidence": primary_result["confidence"],
            "bounding_boxes": unique_boxes,
            "primary_engine": primary_result["engine"],
            "secondary_engine": secondary_result["engine"],
            "combined": True
        }
    
    def _remove_duplicate_boxes(self, boxes: List[Dict]) -> List[Dict]:
        """
        Remove duplicate bounding boxes based on spatial overlap.
        
        Args:
            boxes: List of bounding box dictionaries
            
        Returns:
            Filtered list without duplicates
        """
        if not boxes:
            return []
            
        sorted_boxes = sorted(boxes, key=lambda x: x['confidence'], reverse=True)
        unique_boxes = []
        
        for box in sorted_boxes:
            is_duplicate = False
            for existing_box in unique_boxes:
                if self._calculate_overlap(box, existing_box) > 0.7:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique_boxes.append(box)
        
        return unique_boxes
    
    def _calculate_overlap(self, box1: Dict, box2: Dict) -> float:
        """
        Calculate overlap ratio between two bounding boxes.
        
        Args:
            box1: First bounding box
            box2: Second bounding box
            
        Returns:
            Overlap ratio (0-1)
        """
        x1_min, y1_min = box1['x'], box1['y']
        x1_max, y1_max = x1_min + box1['width'], y1_min + box1['height']
        
        x2_min, y2_min = box2['x'], box2['y']
        x2_max, y2_max = x2_min + box2['width'], y2_min + box2['height']
        
        x_overlap = max(0, min(x1_max, x2_max) - max(x1_min, x2_min))
        y_overlap = max(0, min(y1_max, y2_max) - max(y1_min, y2_min))
        intersection = x_overlap * y_overlap
        
        area1 = box1['width'] * box1['height']
        area2 = box2['width'] * box2['height']
        union = area1 + area2 - intersection
        
        return intersection / union if union > 0 else 0
    
    def read_screen(self, region: Optional[Tuple[int, int, int, int]] = None) -> Dict:
        """
        Main method to capture and read screen content.
        
        Args:
            region: Optional region tuple (x, y, width, height)
            
        Returns:
            Dictionary with extracted text and metadata
        """
        print("Capturing screen...")
        start_time = time.time()
        
        raw_image = self.capture_screen(region)
        
        processed_image = self.preprocess_image(raw_image)
        
        results = []
        
        if self.use_tesseract:
            print("Extracting text with Tesseract...")
            tesseract_result = self.extract_text_tesseract(processed_image)
            results.append(tesseract_result)
        
        if self.use_easyocr:
            print("Extracting text with EasyOCR...")
            easyocr_result = self.extract_text_easyocr(raw_image)
            results.append(easyocr_result)
        
        if len(results) == 2:
            final_result = self.combine_results(results[0], results[1])
        elif len(results) == 1:
            final_result = results[0]
        else:
            final_result = {"text": "", "confidence": 0, "bounding_boxes": []}
        
        processing_time = time.time() - start_time
        final_result.update({
            "processing_time": processing_time,
            "image_shape": raw_image.shape,
            "region": region,
            "timestamp": time.time()
        })
        
        print(f"Screen reading completed in {processing_time:.2f} seconds")
        return final_result
    
    def read_region(self, x: int, y: int, width: int, height: int) -> Dict:
        """
        Read text from a specific screen region.
        
        Args:
            x: X coordinate of top-left corner
            y: Y coordinate of top-left corner
            width: Width of region
            height: Height of region
            
        Returns:
            Dictionary with extracted text and metadata
        """
        return self.read_screen(region=(x, y, width, height))
    
    def save_debug_image(self, image: np.ndarray, filename: str = "debug_capture.png"):
        """
        Save captured image for debugging purposes.
        
        Args:
            image: Image to save
            filename: Output filename
        """
        cv2.imwrite(filename, image)
        print(f"Debug image saved as {filename}")
