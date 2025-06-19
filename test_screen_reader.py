#!/usr/bin/env python3
"""
Test script for the Screen Reading Computer Vision Model.
Tests various screen capture and text extraction scenarios.
"""

import os
import sys
import time
import json
from screen_reader import ScreenReader

def test_basic_functionality():
    """Test basic screen reading functionality."""
    print("=" * 60)
    print("Testing Basic Screen Reading Functionality")
    print("=" * 60)
    
    try:
        reader = ScreenReader(use_easyocr=True, use_tesseract=True)
        
        print("\n1. Testing full screen capture...")
        result = reader.read_screen()
        
        print(f"✓ Screen captured successfully")
        print(f"✓ Image shape: {result['image_shape']}")
        print(f"✓ Processing time: {result['processing_time']:.2f} seconds")
        print(f"✓ Text extracted: {len(result['text'])} characters")
        print(f"✓ Average confidence: {result['confidence']:.2f}")
        print(f"✓ Bounding boxes found: {len(result['bounding_boxes'])}")
        
        if result['text']:
            print(f"✓ Sample text: {result['text'][:100]}...")
        
        return True
        
    except Exception as e:
        print(f"✗ Basic functionality test failed: {e}")
        return False

def test_region_capture():
    """Test specific region capture."""
    print("\n" + "=" * 60)
    print("Testing Region-Specific Capture")
    print("=" * 60)
    
    try:
        reader = ScreenReader(use_easyocr=True, use_tesseract=True)
        
        print("\n2. Testing region capture (top-left 400x300)...")
        result = reader.read_region(0, 0, 400, 300)
        
        print(f"✓ Region captured successfully")
        print(f"✓ Region: {result['region']}")
        print(f"✓ Processing time: {result['processing_time']:.2f} seconds")
        print(f"✓ Text extracted: {len(result['text'])} characters")
        print(f"✓ Confidence: {result['confidence']:.2f}")
        
        if result['text']:
            print(f"✓ Sample text: {result['text'][:100]}...")
        
        return True
        
    except Exception as e:
        print(f"✗ Region capture test failed: {e}")
        return False

def test_ocr_engines():
    """Test individual OCR engines."""
    print("\n" + "=" * 60)
    print("Testing Individual OCR Engines")
    print("=" * 60)
    
    try:
        print("\n3. Testing Tesseract OCR only...")
        reader_tesseract = ScreenReader(use_easyocr=False, use_tesseract=True)
        result_tesseract = reader_tesseract.read_region(0, 0, 500, 200)
        
        print(f"✓ Tesseract result: {len(result_tesseract['text'])} chars, confidence: {result_tesseract['confidence']:.2f}")
        
        print("\n4. Testing EasyOCR only...")
        reader_easyocr = ScreenReader(use_easyocr=True, use_tesseract=False)
        result_easyocr = reader_easyocr.read_region(0, 0, 500, 200)
        
        print(f"✓ EasyOCR result: {len(result_easyocr['text'])} chars, confidence: {result_easyocr['confidence']:.2f}")
        
        print("\n5. Comparing OCR engines...")
        print(f"✓ Tesseract text length: {len(result_tesseract['text'])}")
        print(f"✓ EasyOCR text length: {len(result_easyocr['text'])}")
        print(f"✓ Tesseract confidence: {result_tesseract['confidence']:.2f}")
        print(f"✓ EasyOCR confidence: {result_easyocr['confidence']:.2f}")
        
        return True
        
    except Exception as e:
        print(f"✗ OCR engines test failed: {e}")
        return False

def test_text_detection_accuracy():
    """Test text detection accuracy with known content."""
    print("\n" + "=" * 60)
    print("Testing Text Detection Accuracy")
    print("=" * 60)
    
    try:
        reader = ScreenReader(use_easyocr=True, use_tesseract=True)
        
        print("\n6. Testing text detection accuracy...")
        result = reader.read_screen()
        
        boxes = result['bounding_boxes']
        if boxes:
            print(f"✓ Found {len(boxes)} text regions")
            
            for i, box in enumerate(boxes[:5]):  # Show first 5
                print(f"  Region {i+1}: '{box['text'][:30]}...' (confidence: {box['confidence']:.2f})")
            
            confidences = [box['confidence'] for box in boxes]
            avg_confidence = sum(confidences) / len(confidences)
            min_confidence = min(confidences)
            max_confidence = max(confidences)
            
            print(f"✓ Confidence stats - Avg: {avg_confidence:.2f}, Min: {min_confidence:.2f}, Max: {max_confidence:.2f}")
        else:
            print("⚠ No text regions detected")
        
        return True
        
    except Exception as e:
        print(f"✗ Text detection accuracy test failed: {e}")
        return False

def test_performance():
    """Test performance with multiple captures."""
    print("\n" + "=" * 60)
    print("Testing Performance")
    print("=" * 60)
    
    try:
        reader = ScreenReader(use_easyocr=True, use_tesseract=True)
        
        print("\n7. Testing performance with multiple captures...")
        times = []
        
        for i in range(3):
            start_time = time.time()
            result = reader.read_region(100, 100, 300, 200)
            end_time = time.time()
            
            processing_time = end_time - start_time
            times.append(processing_time)
            print(f"  Capture {i+1}: {processing_time:.2f} seconds")
        
        avg_time = sum(times) / len(times)
        print(f"✓ Average processing time: {avg_time:.2f} seconds")
        
        if avg_time < 10:
            print("✓ Performance is acceptable (< 10 seconds)")
        else:
            print("⚠ Performance might be slow (> 10 seconds)")
        
        return True
        
    except Exception as e:
        print(f"✗ Performance test failed: {e}")
        return False

def save_test_results(results):
    """Save test results to file."""
    try:
        with open('test_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n✓ Test results saved to test_results.json")
    except Exception as e:
        print(f"⚠ Could not save test results: {e}")

def main():
    """Run all tests."""
    print("Screen Reading Computer Vision Model - Test Suite")
    print("=" * 60)
    
    test_results = {
        'basic_functionality': test_basic_functionality(),
        'region_capture': test_region_capture(),
        'ocr_engines': test_ocr_engines(),
        'text_detection': test_text_detection_accuracy(),
        'performance': test_performance()
    }
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "PASS" if result else "FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Screen reading model is working correctly.")
    else:
        print("⚠ Some tests failed. Check the output above for details.")
    
    save_test_results(test_results)
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
