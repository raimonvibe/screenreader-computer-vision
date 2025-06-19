#!/usr/bin/env python3
"""
Demo script for the Screen Reading Computer Vision Model.
Shows practical usage examples and real-time screen reading.
"""

import time
import json
from screen_reader import ScreenReader

def demo_full_screen_reading():
    """Demonstrate full screen reading."""
    print("=" * 60)
    print("DEMO: Full Screen Reading")
    print("=" * 60)
    
    reader = ScreenReader(use_easyocr=True, use_tesseract=True)
    
    print("Reading entire screen content...")
    result = reader.read_screen()
    
    print(f"\n📊 RESULTS:")
    print(f"   Processing time: {result['processing_time']:.2f} seconds")
    print(f"   Text length: {len(result['text'])} characters")
    print(f"   Confidence: {result['confidence']:.2f}%")
    print(f"   Text regions found: {len(result['bounding_boxes'])}")
    
    if result['text']:
        print(f"\n📝 EXTRACTED TEXT (first 500 chars):")
        print("-" * 40)
        print(result['text'][:500])
        if len(result['text']) > 500:
            print("...")
        print("-" * 40)
    
    return result

def demo_region_reading():
    """Demonstrate region-specific reading."""
    print("\n" + "=" * 60)
    print("DEMO: Region-Specific Reading")
    print("=" * 60)
    
    reader = ScreenReader(use_easyocr=True, use_tesseract=True)
    
    print("Reading top-left corner (600x400 pixels)...")
    result = reader.read_region(0, 0, 600, 400)
    
    print(f"\n📊 RESULTS:")
    print(f"   Region: {result['region']}")
    print(f"   Processing time: {result['processing_time']:.2f} seconds")
    print(f"   Text length: {len(result['text'])} characters")
    print(f"   Confidence: {result['confidence']:.2f}%")
    
    if result['text']:
        print(f"\n📝 EXTRACTED TEXT:")
        print("-" * 40)
        print(result['text'])
        print("-" * 40)
    
    return result

def demo_bounding_boxes():
    """Demonstrate bounding box detection."""
    print("\n" + "=" * 60)
    print("DEMO: Text Bounding Box Detection")
    print("=" * 60)
    
    reader = ScreenReader(use_easyocr=True, use_tesseract=True)
    
    print("Detecting text regions with bounding boxes...")
    result = reader.read_region(0, 0, 800, 600)
    
    boxes = result['bounding_boxes']
    print(f"\n📊 FOUND {len(boxes)} TEXT REGIONS:")
    
    for i, box in enumerate(boxes[:10]):  # Show first 10
        print(f"\n   Region {i+1}:")
        print(f"     Position: ({box['x']}, {box['y']})")
        print(f"     Size: {box['width']}x{box['height']}")
        print(f"     Confidence: {box['confidence']:.2f}")
        print(f"     Text: '{box['text'][:50]}{'...' if len(box['text']) > 50 else ''}'")
    
    if len(boxes) > 10:
        print(f"\n   ... and {len(boxes) - 10} more regions")
    
    return result

def demo_engine_comparison():
    """Demonstrate OCR engine comparison."""
    print("\n" + "=" * 60)
    print("DEMO: OCR Engine Comparison")
    print("=" * 60)
    
    x, y, w, h = 0, 0, 500, 300
    
    print("Comparing Tesseract vs EasyOCR performance...")
    
    print("\n🔍 Testing Tesseract OCR...")
    reader_tess = ScreenReader(use_easyocr=False, use_tesseract=True)
    start_time = time.time()
    result_tess = reader_tess.read_region(x, y, w, h)
    tess_time = time.time() - start_time
    
    print("🔍 Testing EasyOCR...")
    reader_easy = ScreenReader(use_easyocr=True, use_tesseract=False)
    start_time = time.time()
    result_easy = reader_easy.read_region(x, y, w, h)
    easy_time = time.time() - start_time
    
    print("🔍 Testing Combined Approach...")
    reader_combined = ScreenReader(use_easyocr=True, use_tesseract=True)
    start_time = time.time()
    result_combined = reader_combined.read_region(x, y, w, h)
    combined_time = time.time() - start_time
    
    print(f"\n📊 COMPARISON RESULTS:")
    print(f"   Tesseract:")
    print(f"     Time: {tess_time:.2f}s")
    print(f"     Text length: {len(result_tess['text'])} chars")
    print(f"     Confidence: {result_tess['confidence']:.2f}")
    print(f"     Regions: {len(result_tess['bounding_boxes'])}")
    
    print(f"\n   EasyOCR:")
    print(f"     Time: {easy_time:.2f}s")
    print(f"     Text length: {len(result_easy['text'])} chars")
    print(f"     Confidence: {result_easy['confidence']:.2f}")
    print(f"     Regions: {len(result_easy['bounding_boxes'])}")
    
    print(f"\n   Combined:")
    print(f"     Time: {combined_time:.2f}s")
    print(f"     Text length: {len(result_combined['text'])} chars")
    print(f"     Confidence: {result_combined['confidence']:.2f}")
    print(f"     Regions: {len(result_combined['bounding_boxes'])}")
    print(f"     Primary engine: {result_combined.get('primary_engine', 'N/A')}")

def demo_real_time_monitoring():
    """Demonstrate real-time screen monitoring."""
    print("\n" + "=" * 60)
    print("DEMO: Real-time Screen Monitoring")
    print("=" * 60)
    
    reader = ScreenReader(use_easyocr=False, use_tesseract=True)  # Faster for real-time
    
    print("Monitoring screen changes (3 captures, 2 seconds apart)...")
    print("This simulates real-time screen reading for automation...")
    
    previous_text = ""
    
    for i in range(3):
        print(f"\n📸 Capture {i+1}/3...")
        result = reader.read_region(0, 0, 400, 200)  # Small region for speed
        
        current_text = result['text']
        
        print(f"   Time: {result['processing_time']:.2f}s")
        print(f"   Text length: {len(current_text)} chars")
        print(f"   Confidence: {result['confidence']:.2f}")
        
        if current_text != previous_text:
            print("   🔄 Screen content changed!")
        else:
            print("   ✓ Screen content unchanged")
        
        previous_text = current_text
        
        if i < 2:  # Don't wait after last capture
            print("   ⏳ Waiting 2 seconds...")
            time.sleep(2)

def save_demo_results(results):
    """Save demo results to file."""
    try:
        with open('demo_results.json', 'w') as f:
            json.dump(results, f, indent=2, default=str)
        print(f"\n💾 Demo results saved to demo_results.json")
    except Exception as e:
        print(f"⚠ Could not save demo results: {e}")

def main():
    """Run all demos."""
    print("🖥️  Screen Reading Computer Vision Model - DEMO")
    print("=" * 60)
    print("This demo will capture and analyze your current screen content.")
    print("Make sure you have some text visible on your screen for best results.")
    
    input("\nPress Enter to start the demo...")
    
    results = {}
    
    try:
        results['full_screen'] = demo_full_screen_reading()
        results['region_reading'] = demo_region_reading()
        results['bounding_boxes'] = demo_bounding_boxes()
        demo_engine_comparison()  # This one doesn't return structured data
        demo_real_time_monitoring()  # This one doesn't return structured data
        
        print("\n" + "=" * 60)
        print("🎉 DEMO COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("The screen reading computer vision model is working correctly.")
        print("You can now use it in your own applications!")
        
        save_demo_results(results)
        
    except Exception as e:
        print(f"\n❌ Demo failed with error: {e}")
        print("Please check your dependencies and try again.")
        return False
    
    return True

if __name__ == "__main__":
    main()
