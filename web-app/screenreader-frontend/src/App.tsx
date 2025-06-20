import { useState, useEffect } from 'react';
import { Settings, Monitor, Square, Loader2, Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HistoryDashboard } from '@/components/HistoryDashboard';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { EnhancedSettings } from '@/components/EnhancedSettings';
import { useOCRHistory } from '@/hooks/use-ocr-history';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useToast } from '@/hooks/use-toast';
import { OCRResult } from '@/types';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [useEasyOCR, setUseEasyOCR] = useState(true);
  const [useTesseract, setUseTesseract] = useState(true);
  const [regionMode, setRegionMode] = useState(false);
  const [region, setRegion] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('capture');
  
  const { addToHistory } = useOCRHistory();
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useKeyboardShortcuts({
    onCaptureScreen: () => captureScreen(),
    onUploadImage: () => document.getElementById('image-upload')?.click(),
    onToggleTesseract: () => setUseTesseract(prev => !prev),
    onToggleEasyOCR: () => setUseEasyOCR(prev => !prev),
    onClearResults: () => setResult(null),
    onToggleRegionMode: () => setRegionMode(prev => !prev),
  }, true);

  const updateConfig = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_easyocr: useEasyOCR, use_tesseract: useTesseract })
      });
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  const captureScreen = async () => {
    setIsCapturing(true);
    try {
      await updateConfig();
      const endpoint = regionMode ? '/api/capture/region' : '/api/capture/screen';
      const body = regionMode ? region : undefined;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data && data.text) {
        addToHistory(data, regionMode ? 'region' : 'screen', undefined, regionMode ? region : undefined);
        toast({
          title: "OCR Complete",
          description: `Extracted ${data.text.length} characters with ${(data.confidence * 100).toFixed(1)}% confidence`,
        });
      }
    } catch (error) {
      console.error('Capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await updateConfig();
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/image`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
      
      if (data && data.text) {
        addToHistory(data, 'upload', file.name);
        toast({
          title: "OCR Complete",
          description: `Extracted ${data.text.length} characters from ${file.name}`,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Eye className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold dark:text-white">Screen Reader CV</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm dark:text-gray-300">Dark Mode</span>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger value="capture" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>OCR Capture</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>History & Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="mt-6">
            <div className="space-y-6">

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Settings className="h-5 w-5" />
                    <span>Configuration</span>
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Configure OCR engines and capture settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="tesseract"
                        checked={useTesseract}
                        onCheckedChange={setUseTesseract}
                      />
                      <Label htmlFor="tesseract" className="dark:text-gray-300">Use Tesseract OCR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="easyocr"
                        checked={useEasyOCR}
                        onCheckedChange={setUseEasyOCR}
                      />
                      <Label htmlFor="easyocr" className="dark:text-gray-300">Use EasyOCR</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="region-mode"
                      checked={regionMode}
                      onCheckedChange={setRegionMode}
                    />
                    <Label htmlFor="region-mode" className="dark:text-gray-300">Region Capture Mode</Label>
                  </div>

                  {regionMode && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <Label htmlFor="x" className="text-sm dark:text-gray-300">X</Label>
                        <Input
                          id="x"
                          type="number"
                          value={region.x}
                          onChange={(e) => setRegion({...region, x: parseInt(e.target.value) || 0})}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="y" className="text-sm dark:text-gray-300">Y</Label>
                        <Input
                          id="y"
                          type="number"
                          value={region.y}
                          onChange={(e) => setRegion({...region, y: parseInt(e.target.value) || 0})}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="width" className="text-sm dark:text-gray-300">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={region.width}
                          onChange={(e) => setRegion({...region, width: parseInt(e.target.value) || 0})}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-sm dark:text-gray-300">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={region.height}
                          onChange={(e) => setRegion({...region, height: parseInt(e.target.value) || 0})}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Button
                      onClick={captureScreen}
                      disabled={isCapturing || isUploading || (!useTesseract && !useEasyOCR)}
                      size="lg"
                      className="flex items-center space-x-2"
                    >
                      {isCapturing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : regionMode ? (
                        <Square className="h-5 w-5" />
                      ) : (
                        <Monitor className="h-5 w-5" />
                      )}
                      <span>
                        {isCapturing ? 'Capturing...' : regionMode ? 'Capture Region' : 'Capture Screen'}
                      </span>
                    </Button>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                      <span>or</span>
                      <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Button
                          asChild
                          disabled={isCapturing || isUploading || (!useTesseract && !useEasyOCR)}
                          size="lg"
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <span>
                            {isUploading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Upload className="h-5 w-5" />
                            )}
                            <span>
                              {isUploading ? 'Processing...' : 'Upload Image'}
                            </span>
                          </span>
                        </Button>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={uploadImage}
                        className="hidden"
                        disabled={isCapturing || isUploading || (!useTesseract && !useEasyOCR)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result && (
                <div className="space-y-4">
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-500">{result.processing_time.toFixed(2)}s</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Processing Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{(result.confidence * 100).toFixed(1)}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-500">{result.text.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-500">{result.bounding_boxes.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Text Regions</div>
                        </div>
                      </div>
                      {result.primary_engine && (
                        <div className="mt-4 flex items-center space-x-2">
                          <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                            Primary: {result.primary_engine}
                          </Badge>
                          {result.combined && (
                            <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                              Combined Results
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">Extracted Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={result.text}
                        readOnly
                        className="min-h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="No text extracted"
                      />
                    </CardContent>
                  </Card>

                  {result.bounding_boxes.length > 0 && (
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="dark:text-white">Text Regions</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="show-boxes"
                              checked={showBoundingBoxes}
                              onCheckedChange={setShowBoundingBoxes}
                            />
                            <Label htmlFor="show-boxes" className="text-sm dark:text-gray-300">Show Details</Label>
                          </div>
                        </div>
                      </CardHeader>
                      {showBoundingBoxes && (
                        <CardContent>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {result.bounding_boxes.map((box: any, index: number) => (
                              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                                    Region {index + 1}
                                  </Badge>
                                  <Badge 
                                    variant={box.confidence > 80 ? "default" : box.confidence > 50 ? "secondary" : "destructive"}
                                    className="text-xs"
                                  >
                                    {box.confidence.toFixed(1)}%
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  Position: ({box.x}, {box.y}) • Size: {box.width}×{box.height}
                                </div>
                                <div className="text-sm font-medium dark:text-white">
                                  "{box.text}"
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-6">
                <HistoryDashboard />
              </TabsContent>
              <TabsContent value="analytics" className="mt-6">
                <AnalyticsPanel />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <EnhancedSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
