export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  confidence: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  bounding_boxes: BoundingBox[];
  processing_time: number;
  engine?: string;
  primary_engine?: string;
  combined?: boolean;
}

export interface OCRHistoryItem extends OCRResult {
  id: string;
  timestamp: number;
  source: 'screen' | 'region' | 'upload';
  filename?: string;
  region?: { x: number; y: number; width: number; height: number };
  tags: string[];
  notes?: string;
}

export interface OCRAnalytics {
  totalProcessed: number;
  averageProcessingTime: number;
  averageConfidence: number;
  engineUsage: { tesseract: number; easyocr: number; combined: number };
  dailyStats: { date: string; count: number; avgTime: number; avgConfidence: number }[];
}

export interface AppSettings {
  maxHistoryItems: number;
  autoSave: boolean;
  defaultEngine: 'tesseract' | 'easyocr' | 'both';
  keyboardShortcuts: boolean;
  language: string;
  preprocessing: {
    contrast: number;
    brightness: number;
    noiseReduction: boolean;
  };
}

export interface AppStorage {
  history: OCRHistoryItem[];
  analytics: OCRAnalytics;
  settings: AppSettings;
  version: string;
}
