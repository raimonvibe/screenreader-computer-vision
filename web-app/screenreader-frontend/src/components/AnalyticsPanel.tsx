
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Target, Zap, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOCRAnalytics } from '@/hooks/use-ocr-analytics';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function AnalyticsPanel() {
  const { analytics, isLoading, getMostUsedEngine } = useOCRAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  const mostUsedEngine = getMostUsedEngine();

  const engineData = [
    { name: 'Tesseract', value: analytics.engineUsage.tesseract, color: COLORS[0] },
    { name: 'EasyOCR', value: analytics.engineUsage.easyocr, color: COLORS[1] },
    { name: 'Combined', value: analytics.engineUsage.combined, color: COLORS[2] },
  ].filter(item => item.value > 0);

  const dailyChartData = analytics.dailyStats.slice(0, 7).reverse().map((stat: any) => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: stat.count,
    avgTime: stat.avgTime,
    avgConfidence: stat.avgConfidence * 100,
  }));

  return (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-white">
            <Activity className="h-5 w-5" />
            <span>OCR Analytics</span>
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Insights into your OCR processing patterns and performance
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Processed</p>
                <p className="text-2xl font-bold dark:text-white">{analytics.totalProcessed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Processing Time</p>
                <p className="text-2xl font-bold dark:text-white">{analytics.averageProcessingTime.toFixed(2)}s</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Confidence</p>
                <p className="text-2xl font-bold dark:text-white">{(analytics.averageConfidence * 100).toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preferred Engine</p>
                <p className="text-lg font-bold dark:text-white capitalize">{mostUsedEngine}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Daily Activity (Last 7 Days)</CardTitle>
            <CardDescription className="dark:text-gray-400">
              OCR processing count per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Engine Usage Distribution</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Breakdown of OCR engine preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            {engineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={engineData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {engineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                No engine usage data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Processing Time Trend</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Average processing time over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="avgTime" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Weekly & Monthly Summary</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Performance overview for recent periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium dark:text-gray-300">This Week</h4>
                <div className="text-2xl font-bold text-blue-500">
                  {analytics.dailyStats.slice(0, 7).reduce((sum: number, day: any) => sum + day.count, 0)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  OCR operations processed
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium dark:text-gray-300">This Month</h4>
                <div className="text-2xl font-bold text-green-500">
                  {analytics.dailyStats.reduce((sum: number, day: any) => sum + day.count, 0)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total operations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
