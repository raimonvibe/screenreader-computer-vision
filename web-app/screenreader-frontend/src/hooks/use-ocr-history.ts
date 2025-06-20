import { useState, useEffect } from 'react';
import { OCRHistoryItem, OCRResult } from '@/types';
import { loadAppData, addHistoryItem, clearHistory } from '@/lib/storage';

export function useOCRHistory() {
  const [history, setHistory] = useState<OCRHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = loadAppData();
    setHistory(data.history);
    setIsLoading(false);
  }, []);

  const addToHistory = (result: OCRResult, source: 'screen' | 'region' | 'upload', filename?: string, region?: { x: number; y: number; width: number; height: number }) => {
    const historyItem: OCRHistoryItem = {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      source,
      filename,
      region,
      tags: [],
      notes: '',
    };

    addHistoryItem(historyItem);
    setHistory(prev => [historyItem, ...prev.slice(0, 99)]);
  };

  const clearAllHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const updateHistoryItem = (id: string, updates: Partial<OCRHistoryItem>) => {
    const data = loadAppData();
    const index = data.history.findIndex(item => item.id === id);
    if (index !== -1) {
      data.history[index] = { ...data.history[index], ...updates };
      setHistory([...data.history]);
    }
  };

  const deleteHistoryItem = (id: string) => {
    const data = loadAppData();
    data.history = data.history.filter(item => item.id !== id);
    setHistory(data.history);
  };

  const searchHistory = (query: string) => {
    if (!query.trim()) return history;
    
    const lowercaseQuery = query.toLowerCase();
    return history.filter(item => 
      item.text.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      (item.notes && item.notes.toLowerCase().includes(lowercaseQuery))
    );
  };

  return {
    history,
    isLoading,
    addToHistory,
    clearAllHistory,
    updateHistoryItem,
    deleteHistoryItem,
    searchHistory,
  };
}
