import { AppStorage, OCRHistoryItem, OCRAnalytics, AppSettings } from '@/types';

const STORAGE_KEY = 'screenreader-cv-data';
const STORAGE_VERSION = '1.0.0';

const defaultSettings: AppSettings = {
  maxHistoryItems: 100,
  autoSave: true,
  defaultEngine: 'both',
  keyboardShortcuts: true,
  language: 'eng',
  preprocessing: {
    contrast: 1.0,
    brightness: 1.0,
    noiseReduction: false,
  },
};

const defaultAnalytics: OCRAnalytics = {
  totalProcessed: 0,
  averageProcessingTime: 0,
  averageConfidence: 0,
  engineUsage: { tesseract: 0, easyocr: 0, combined: 0 },
  dailyStats: [],
};

export function loadAppData(): AppStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        history: [],
        analytics: defaultAnalytics,
        settings: defaultSettings,
        version: STORAGE_VERSION,
      };
    }

    const data = JSON.parse(stored) as AppStorage;
    
    if (data.version !== STORAGE_VERSION) {
      return migrateData(data);
    }

    return {
      ...data,
      settings: { ...defaultSettings, ...data.settings },
      analytics: { ...defaultAnalytics, ...data.analytics },
    };
  } catch (error) {
    console.error('Failed to load app data:', error);
    return {
      history: [],
      analytics: defaultAnalytics,
      settings: defaultSettings,
      version: STORAGE_VERSION,
    };
  }
}

export function saveAppData(data: AppStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save app data:', error);
  }
}

export function addHistoryItem(item: OCRHistoryItem): void {
  const data = loadAppData();
  data.history.unshift(item);
  
  if (data.history.length > data.settings.maxHistoryItems) {
    data.history = data.history.slice(0, data.settings.maxHistoryItems);
  }
  
  updateAnalytics(data, item);
  saveAppData(data);
}

export function updateAnalytics(data: AppStorage, item: OCRHistoryItem): void {
  const analytics = data.analytics;
  
  analytics.totalProcessed += 1;
  analytics.averageProcessingTime = 
    (analytics.averageProcessingTime * (analytics.totalProcessed - 1) + item.processing_time) / analytics.totalProcessed;
  analytics.averageConfidence = 
    (analytics.averageConfidence * (analytics.totalProcessed - 1) + item.confidence) / analytics.totalProcessed;

  if (item.primary_engine === 'tesseract') {
    analytics.engineUsage.tesseract += 1;
  } else if (item.primary_engine === 'easyocr') {
    analytics.engineUsage.easyocr += 1;
  } else {
    analytics.engineUsage.combined += 1;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayStats = analytics.dailyStats.find(stat => stat.date === today);
  
  if (todayStats) {
    todayStats.count += 1;
    todayStats.avgTime = (todayStats.avgTime * (todayStats.count - 1) + item.processing_time) / todayStats.count;
    todayStats.avgConfidence = (todayStats.avgConfidence * (todayStats.count - 1) + item.confidence) / todayStats.count;
  } else {
    analytics.dailyStats.push({
      date: today,
      count: 1,
      avgTime: item.processing_time,
      avgConfidence: item.confidence,
    });
  }

  analytics.dailyStats = analytics.dailyStats
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30);
}

export function updateSettings(newSettings: Partial<AppSettings>): void {
  const data = loadAppData();
  data.settings = { ...data.settings, ...newSettings };
  saveAppData(data);
}

export function clearHistory(): void {
  const data = loadAppData();
  data.history = [];
  saveAppData(data);
}

export function exportData(): string {
  const data = loadAppData();
  return JSON.stringify(data, null, 2);
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData) as AppStorage;
    saveAppData(data);
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

function migrateData(oldData: any): AppStorage {
  return {
    history: oldData.history || [],
    analytics: { ...defaultAnalytics, ...oldData.analytics },
    settings: { ...defaultSettings, ...oldData.settings },
    version: STORAGE_VERSION,
  };
}
