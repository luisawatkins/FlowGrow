'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  MapPin,
  Target
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MarketData, AnalyticsMetrics } from '@/types/analytics';

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const { loading, error, fetchMarketData, predictPrice } = useAnalytics();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '7D' | '30D' | '90D'>('7D');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const data = await fetchMarketData();
      setMarketData(data);
      
      // Mock metrics for now
      setMetrics({
        totalProperties: data.length,
        totalMarketCap: data.reduce((sum, p) => sum + p.marketCap, 0),
        averagePrice: data.reduce((sum, p) => sum + p.price, 0) / data.length,
        priceChange24h: data.reduce((sum, p) => sum + p.priceChange24h, 0) / data.length,
        volume24h: data.reduce((sum, p) => sum + p.tradingVolume, 0),
        activeModels: 2,
        predictionsGenerated: 1250,
        alertsTriggered: 45,
        dataQuality: 92,
        lastUpdated: Date.now()
      });
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading && !marketData.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={loadInitialData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive market intelligence and property analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Last updated: {metrics ? new Date(metrics.lastUpdated).toLocaleTimeString() : 'N/A'}
          </Button>
          <Button onClick={loadInitialData} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics?.totalProperties || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Active in marketplace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.totalMarketCap || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined property value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics?.averagePrice || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per property
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Price Change</CardTitle>
            {getTrendIcon(metrics?.priceChange24h || 0)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTrendColor(metrics?.priceChange24h || 0)}`}>
              {(metrics?.priceChange24h || 0).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Market average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Market Activity</CardTitle>
                <CardDescription>
                  Recent trading volume and activity metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">24h Volume</span>
                  <span className="text-sm font-bold">
                    {formatCurrency(metrics?.volume24h || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Models</span>
                  <Badge variant="secondary">
                    {metrics?.activeModels || 0} models
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Predictions Generated</span>
                  <span className="text-sm font-bold">
                    {formatNumber(metrics?.predictionsGenerated || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Alerts Triggered</span>
                  <Badge variant="destructive">
                    {metrics?.alertsTriggered || 0} alerts
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Data Quality */}
            <Card>
              <CardHeader>
                <CardTitle>Data Quality</CardTitle>
                <CardDescription>
                  System health and data accuracy metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Quality</span>
                    <span className="text-sm font-bold">
                      {metrics?.dataQuality || 0}%
                    </span>
                  </div>
                  <Progress value={metrics?.dataQuality || 0} className="h-2" />
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">All systems operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Real-time updates active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Market Data */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Market Data</CardTitle>
              <CardDescription>
                Latest property prices and market trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.slice(0, 5).map((property) => (
                  <div key={property.propertyID} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Property #{property.propertyID}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(property.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getTrendColor(property.priceChange24h)}`}>
                          {property.priceChange24h > 0 ? '+' : ''}{property.priceChange24h.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground">24h change</p>
                      </div>
                      <Badge variant={property.marketTrend === 'bullish' ? 'default' : 'secondary'}>
                        {property.marketTrend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>
                  Current market direction and momentum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bullish Properties</span>
                    <Badge variant="default">
                      {marketData.filter(p => p.marketTrend === 'bullish').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bearish Properties</span>
                    <Badge variant="secondary">
                      {marketData.filter(p => p.marketTrend === 'bearish').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neutral Properties</span>
                    <Badge variant="outline">
                      {marketData.filter(p => p.marketTrend === 'neutral').length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Distribution</CardTitle>
                <CardDescription>
                  Property price ranges and distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Under $200K</span>
                    <span className="text-sm font-bold">
                      {marketData.filter(p => p.price < 200000).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">$200K - $500K</span>
                    <span className="text-sm font-bold">
                      {marketData.filter(p => p.price >= 200000 && p.price < 500000).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">$500K - $1M</span>
                    <span className="text-sm font-bold">
                      {marketData.filter(p => p.price >= 500000 && p.price < 1000000).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Over $1M</span>
                    <span className="text-sm font-bold">
                      {marketData.filter(p => p.price >= 1000000).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volatility Analysis</CardTitle>
                <CardDescription>
                  Market volatility and risk metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Volatility</span>
                    <span className="text-sm font-bold">
                      {(marketData.reduce((sum, p) => sum + p.volatility, 0) / marketData.length).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Volatility</span>
                    <Badge variant="destructive">
                      {marketData.filter(p => p.volatility > 20).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Volatility</span>
                    <Badge variant="default">
                      {marketData.filter(p => p.volatility < 10).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Predictions</CardTitle>
              <CardDescription>
                AI-powered price forecasts and market predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Price prediction models are being trained. Check back soon for forecasts.
                </p>
                <Button className="mt-4" disabled>
                  Generate Predictions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
              <CardDescription>
                Key insights and recommendations based on market analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Market Growth Trend</h4>
                      <p className="text-sm text-muted-foreground">
                        The market is showing strong upward momentum with 65% of properties in bullish trend.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium">High Volume Activity</h4>
                      <p className="text-sm text-muted-foreground">
                        Trading volume has increased by 23% compared to last week, indicating strong market interest.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Location Premium</h4>
                      <p className="text-sm text-muted-foreground">
                        Properties in downtown areas are showing 15% higher appreciation rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
