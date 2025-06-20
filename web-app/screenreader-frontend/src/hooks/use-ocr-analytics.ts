import { useState, useEffect } from 'react';
import { OCRAnalytics } from '@/types';
import { loadAppData } from '@/lib/storage';

export function useOCRAnalytics() {
  const [analytics, setAnalytics] = useState<OCRAnalytics>({
    totalProcessed: 0,
    averageProcessingTime: 0,
    averageConfidence: 0,
    engineUsage: { tesseract: 0, easyocr: 0, combined: 0 },
    dailyStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = loadAppData();
    setAnalytics(data.analytics);
    setIsLoading(false);
  }, []);

  const refreshAnalytics = () => {
    const data = loadAppData();
    setAnalytics(data.analytics);
  };

  const getWeeklyStats = () => {
    const weeklyData = analytics.dailyStats.slice(0, 7);
    return weeklyData.reduce((acc, day) => ({
      totalCount: acc.totalCount + day.count,
      avgTime: acc.avgTime + day.avgTime,
      avgConfidence: acc.avgConfidence + day.avgConfidence,
    }), { totalCount: 0, avgTime: 0, avgConfidence: 0 });
  };

  const getMonthlyStats = () => {
    const monthlyData = analytics.dailyStats.slice(0, 30);
    return monthlyData.reduce((acc, day) => ({
      totalCount: acc.totalCount + day.count,
      avgTime: acc.avgTime + day.avgTime,
      avgConfidence: acc.avgConfidence + day.avgConfidence,
    }), { totalCount: 0, avgTime: 0, avgConfidence: 0 });
  };

  const getMostUsedEngine = () => {
    const { tesseract, easyocr, combined } = analytics.engineUsage;
    if (tesseract >= easyocr && tesseract >= combined) return 'tesseract';
    if (easyocr >= combined) return 'easyocr';
    return 'combined';
  };

  return {
    analytics,
    isLoading,
    refreshAnalytics,
    getWeeklyStats,
    getMonthlyStats,
    getMostUsedEngine,
  };
}
