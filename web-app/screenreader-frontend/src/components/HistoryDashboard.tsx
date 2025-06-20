import { useState } from 'react';
import { Search, Download, Trash2, Tag, Calendar, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOCRHistory } from '@/hooks/use-ocr-history';
import { BoundingBox } from '@/types';

export function HistoryDashboard() {
  const { history, isLoading, clearAllHistory, deleteHistoryItem, searchHistory } = useOCRHistory();
  const [searchQuery, setSearchQuery] = useState('');


  const filteredHistory = searchHistory(searchQuery);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'screen': return '🖥️';
      case 'region': return '📐';
      case 'upload': return '📁';
      default: return '📄';
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocr-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-white">
            <Clock className="h-5 w-5" />
            <span>OCR History</span>
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            View and manage your OCR processing history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button
              onClick={exportHistory}
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={clearAllHistory}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredHistory.length} of {history.length} items
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center text-gray-500 dark:text-gray-400">
                {history.length === 0 ? 'No OCR history yet' : 'No results found'}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((item) => (
            <Card key={item.id} className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSourceIcon(item.source)}</span>
                      <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                        {item.source}
                      </Badge>
                      {item.filename && (
                        <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                          {item.filename}
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.timestamp)}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                        <span className="ml-2 font-medium dark:text-white">
                          {(item.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Time:</span>
                        <span className="ml-2 font-medium dark:text-white">
                          {item.processing_time.toFixed(2)}s
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Engine:</span>
                        <span className="ml-2 font-medium dark:text-white">
                          {item.primary_engine || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm dark:text-gray-300">
                      <span className="text-gray-500 dark:text-gray-400">Text:</span>
                      <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs max-h-20 overflow-y-auto">
                        {item.text || 'No text extracted'}
                      </div>
                    </div>

                    {item.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3 text-gray-400" />
                        {item.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="dark:border-gray-600 dark:text-gray-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="dark:text-white">OCR Result Details</DialogTitle>
                              <DialogDescription className="dark:text-gray-400">
                                {formatDate(item.timestamp)} • {item.source}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium dark:text-gray-300">Extracted Text</label>
                                <Textarea
                                  value={item.text}
                                  readOnly
                                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                  rows={6}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium dark:text-gray-300">Confidence</label>
                                  <div className="text-lg font-bold dark:text-white">
                                    {(item.confidence * 100).toFixed(1)}%
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium dark:text-gray-300">Processing Time</label>
                                  <div className="text-lg font-bold dark:text-white">
                                    {item.processing_time.toFixed(2)}s
                                  </div>
                                </div>
                              </div>
                              {item.bounding_boxes.length > 0 && (
                                <div>
                                  <label className="text-sm font-medium dark:text-gray-300">
                                    Text Regions ({item.bounding_boxes.length})
                                  </label>
                                  <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                                    {item.bounding_boxes.map((box: BoundingBox, index: number) => (
                                      <div key={index} className="text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                        <div className="font-medium dark:text-white">"{box.text}"</div>
                                        <div className="text-gray-500 dark:text-gray-400">
                                          Position: ({box.x}, {box.y}) • Size: {box.width}×{box.height} • 
                                          Confidence: {box.confidence.toFixed(1)}%
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl dark:bg-gray-800 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">OCR Result Details</DialogTitle>
                          <DialogDescription className="dark:text-gray-400">
                            {formatDate(item.timestamp)} • {item.source}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium dark:text-gray-300">Extracted Text</label>
                            <Textarea
                              value={item.text}
                              readOnly
                              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              rows={6}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium dark:text-gray-300">Confidence</label>
                              <div className="text-lg font-bold dark:text-white">
                                {(item.confidence * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium dark:text-gray-300">Processing Time</label>
                              <div className="text-lg font-bold dark:text-white">
                                {item.processing_time.toFixed(2)}s
                              </div>
                            </div>
                          </div>
                          {item.bounding_boxes.length > 0 && (
                            <div>
                              <label className="text-sm font-medium dark:text-gray-300">
                                Text Regions ({item.bounding_boxes.length})
                              </label>
                              <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                                {item.bounding_boxes.map((box: BoundingBox, index: number) => (
                                  <div key={index} className="text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div className="font-medium dark:text-white">"{box.text}"</div>
                                    <div className="text-gray-500 dark:text-gray-400">
                                      Position: ({box.x}, {box.y}) • Size: {box.width}×{box.height} • 
                                      Confidence: {box.confidence.toFixed(1)}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteHistoryItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
