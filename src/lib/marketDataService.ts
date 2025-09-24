import {
  MarketData,
  PropertyInsight,
  PredictiveAnalytics,
  MarketReport,
  MarketIntelligence,
  MarketAlert,
  DataVisualization,
  MarketComparison,
  InvestmentOpportunity,
  RiskAssessment,
  MarketIntelligenceDashboard,
  MarketIntelligenceSearchFilters
} from '@/types/marketIntelligence';

// Mock data for development
const mockMarketData: MarketData[] = [
  {
    id: '1',
    location: 'Beverly Hills, CA',
    propertyType: 'Single Family',
    date: '2024-01-01',
    medianPrice: 2500000,
    averagePrice: 2750000,
    pricePerSqFt: 850,
    totalListings: 45,
    newListings: 12,
    soldListings: 8,
    daysOnMarket: 28,
    inventoryLevel: 5.6,
    priceChange: 5.2,
    yearOverYearChange: 8.7,
    marketTrend: 'up',
    seasonality: 0.15,
    demandScore: 85,
    supplyScore: 65,
    marketHealth: 'healthy'
  },
  {
    id: '2',
    location: 'West Hollywood, CA',
    propertyType: 'Condo',
    date: '2024-01-01',
    medianPrice: 1200000,
    averagePrice: 1350000,
    pricePerSqFt: 950,
    totalListings: 78,
    newListings: 18,
    soldListings: 15,
    daysOnMarket: 22,
    inventoryLevel: 5.2,
    priceChange: 3.8,
    yearOverYearChange: 6.2,
    marketTrend: 'up',
    seasonality: 0.12,
    demandScore: 92,
    supplyScore: 58,
    marketHealth: 'healthy'
  }
];

const mockPropertyInsights: PropertyInsight[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    insightType: 'price',
    title: 'Property Undervalued by 12%',
    description: 'Based on recent comparable sales and market trends, this property appears to be undervalued.',
    confidence: 85,
    impact: 'high',
    timeframe: 'short',
    dataPoints: [
      {
        id: '1',
        metric: 'Price per Sq Ft',
        value: 750,
        unit: '$/sqft',
        trend: 'up',
        change: 25,
        changePercentage: 3.4,
        benchmark: 850,
        percentile: 75,
        significance: 'high'
      }
    ],
    recommendations: [
      'Consider increasing asking price by 10-15%',
      'Monitor market conditions for optimal timing',
      'Highlight unique property features in marketing'
    ],
    riskFactors: [
      'Market volatility may affect pricing',
      'Seasonal fluctuations in demand'
    ],
    opportunities: [
      'Strong buyer demand in the area',
      'Limited inventory of similar properties'
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

const mockPredictiveAnalytics: PredictiveAnalytics[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    modelType: 'price_forecast',
    prediction: {
      value: 2800000,
      confidence: 78,
      timeframe: '6 months',
      factors: ['Market trends', 'Seasonal patterns', 'Local development']
    },
    scenarios: {
      optimistic: 3200000,
      realistic: 2800000,
      pessimistic: 2400000
    },
    accuracy: 82,
    lastUpdated: '2024-01-15',
    nextUpdate: '2024-02-15'
  }
];

const mockMarketReports: MarketReport[] = [
  {
    id: '1',
    title: 'Beverly Hills Market Analysis Q1 2024',
    location: 'Beverly Hills, CA',
    propertyType: 'Single Family',
    reportType: 'market_overview',
    period: {
      start: '2024-01-01',
      end: '2024-03-31'
    },
    summary: 'The Beverly Hills market continues to show strong growth with increasing demand and limited supply.',
    keyFindings: [
      'Median home prices increased 5.2% quarter-over-quarter',
      'Days on market decreased to 28 days',
      'Inventory levels remain low at 5.6 months'
    ],
    marketMetrics: [
      {
        id: '1',
        name: 'Median Price',
        value: 2500000,
        unit: '$',
        change: 125000,
        changePercentage: 5.2,
        trend: 'up',
        benchmark: 2400000,
        significance: 'high',
        description: 'Median home price in the area'
      }
    ],
    charts: [],
    recommendations: [
      'Consider investing in properties with growth potential',
      'Monitor interest rate changes',
      'Focus on properties with unique features'
    ],
    riskFactors: [
      'Potential interest rate increases',
      'Economic uncertainty',
      'Seasonal market fluctuations'
    ],
    opportunities: [
      'Strong demand from international buyers',
      'Limited new construction',
      'Prime location advantages'
    ],
    methodology: 'Analysis based on MLS data, public records, and market trends',
    dataSources: ['MLS', 'Public Records', 'Market Surveys'],
    generatedBy: 'AI Analytics Engine',
    generatedAt: '2024-01-15',
    isPublic: true,
    tags: ['beverly-hills', 'single-family', 'q1-2024']
  }
];

export class MarketDataService {
  // Market Data Management
  static async getMarketData(filters?: MarketIntelligenceSearchFilters): Promise<MarketData[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...mockMarketData];
    
    if (filters) {
      if (filters.location) {
        filteredData = filteredData.filter(data => 
          data.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.propertyType) {
        filteredData = filteredData.filter(data => 
          data.propertyType.toLowerCase().includes(filters.propertyType!.toLowerCase())
        );
      }
      
      if (filters.marketTrend) {
        filteredData = filteredData.filter(data => 
          data.marketTrend === filters.marketTrend
        );
      }
    }
    
    return filteredData;
  }

  static async getMarketDataById(id: string): Promise<MarketData | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMarketData.find(data => data.id === id) || null;
  }

  // Property Insights
  static async getPropertyInsights(propertyId: string): Promise<PropertyInsight[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockPropertyInsights.filter(insight => insight.propertyId === propertyId);
  }

  static async createPropertyInsight(insightData: Partial<PropertyInsight>): Promise<PropertyInsight> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newInsight: PropertyInsight = {
      id: Date.now().toString(),
      propertyId: insightData.propertyId || '',
      insightType: insightData.insightType || 'price',
      title: insightData.title || '',
      description: insightData.description || '',
      confidence: insightData.confidence || 0,
      impact: insightData.impact || 'low',
      timeframe: insightData.timeframe || 'short',
      dataPoints: insightData.dataPoints || [],
      recommendations: insightData.recommendations || [],
      riskFactors: insightData.riskFactors || [],
      opportunities: insightData.opportunities || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPropertyInsights.push(newInsight);
    return newInsight;
  }

  // Predictive Analytics
  static async getPredictiveAnalytics(propertyId: string): Promise<PredictiveAnalytics[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockPredictiveAnalytics.filter(prediction => prediction.propertyId === propertyId);
  }

  static async generatePriceForecast(
    propertyId: string,
    timeframe: string = '6 months'
  ): Promise<PredictiveAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock price forecast calculation
    const basePrice = 2500000;
    const growthRate = 0.05; // 5% annual growth
    const timeframeMonths = parseInt(timeframe);
    const forecastPrice = basePrice * Math.pow(1 + growthRate, timeframeMonths / 12);
    
    return {
      id: Date.now().toString(),
      propertyId,
      modelType: 'price_forecast',
      prediction: {
        value: forecastPrice,
        confidence: 75,
        timeframe,
        factors: ['Market trends', 'Historical data', 'Economic indicators']
      },
      scenarios: {
        optimistic: forecastPrice * 1.15,
        realistic: forecastPrice,
        pessimistic: forecastPrice * 0.85
      },
      accuracy: 78,
      lastUpdated: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Market Reports
  static async getMarketReports(filters?: any): Promise<MarketReport[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockMarketReports;
  }

  static async generateMarketReport(params: {
    location: string;
    propertyType: string;
    period: { start: string; end: string };
    reportType: string;
  }): Promise<MarketReport> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const report: MarketReport = {
      id: Date.now().toString(),
      title: `${params.location} Market Analysis`,
      location: params.location,
      propertyType: params.propertyType,
      reportType: params.reportType as any,
      period: params.period,
      summary: `Comprehensive market analysis for ${params.location} ${params.propertyType} properties.`,
      keyFindings: [
        'Market shows strong growth potential',
        'Limited inventory driving price increases',
        'High demand from qualified buyers'
      ],
      marketMetrics: [
        {
          id: '1',
          name: 'Median Price',
          value: 2500000,
          unit: '$',
          change: 125000,
          changePercentage: 5.2,
          trend: 'up',
          benchmark: 2400000,
          significance: 'high',
          description: 'Median home price in the area'
        }
      ],
      charts: [],
      recommendations: [
        'Consider investing in properties with growth potential',
        'Monitor market conditions closely',
        'Focus on properties with unique features'
      ],
      riskFactors: [
        'Market volatility',
        'Interest rate changes',
        'Economic uncertainty'
      ],
      opportunities: [
        'Strong demand',
        'Limited supply',
        'Prime location'
      ],
      methodology: 'Analysis based on comprehensive market data and AI algorithms',
      dataSources: ['MLS', 'Public Records', 'Market Surveys', 'Economic Data'],
      generatedBy: 'AI Analytics Engine',
      generatedAt: new Date().toISOString(),
      isPublic: true,
      tags: [params.location.toLowerCase(), params.propertyType.toLowerCase()]
    };
    
    mockMarketReports.push(report);
    return report;
  }

  // Market Alerts
  static async getMarketAlerts(filters?: any): Promise<MarketAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockAlerts: MarketAlert[] = [
      {
        id: '1',
        type: 'price_change',
        severity: 'medium',
        title: 'Significant Price Increase in Beverly Hills',
        description: 'Median home prices in Beverly Hills increased by 5.2% this quarter.',
        location: 'Beverly Hills, CA',
        propertyType: 'Single Family',
        impact: 'Positive for sellers, challenging for buyers',
        actionRequired: false,
        isRead: false,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        type: 'opportunity',
        severity: 'high',
        title: 'Investment Opportunity in West Hollywood',
        description: 'New development project creating investment opportunities in the area.',
        location: 'West Hollywood, CA',
        propertyType: 'Condo',
        impact: 'High potential for appreciation',
        actionRequired: true,
        actionUrl: '/opportunities/wh-development',
        isRead: false,
        createdAt: '2024-01-14'
      }
    ];
    
    return mockAlerts;
  }

  // Investment Opportunities
  static async getInvestmentOpportunities(filters?: any): Promise<InvestmentOpportunity[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockOpportunities: InvestmentOpportunity[] = [
      {
        id: '1',
        propertyId: 'prop-1',
        location: 'Beverly Hills, CA',
        propertyType: 'Single Family',
        opportunityType: 'undervalued',
        score: 85,
        confidence: 78,
        expectedReturn: {
          annual: 12.5,
          total: 35.2,
          timeframe: '3 years'
        },
        riskLevel: 'medium',
        factors: {
          positive: [
            'Prime location',
            'Limited inventory',
            'Strong demand'
          ],
          negative: [
            'High entry cost',
            'Market volatility',
            'Maintenance costs'
          ]
        },
        marketConditions: {
          demand: 'high',
          supply: 'low',
          competition: 'medium'
        },
        recommendations: [
          'Conduct thorough due diligence',
          'Consider financing options',
          'Monitor market trends'
        ],
        timeline: '3-6 months',
        createdAt: '2024-01-15'
      }
    ];
    
    return mockOpportunities;
  }

  // Risk Assessment
  static async getRiskAssessments(propertyId: string): Promise<RiskAssessment[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockAssessments: RiskAssessment[] = [
      {
        id: '1',
        propertyId,
        location: 'Beverly Hills, CA',
        riskType: 'market',
        riskLevel: 'medium',
        probability: 45,
        impact: 60,
        description: 'Market volatility risk due to economic uncertainty',
        factors: [
          'Interest rate fluctuations',
          'Economic indicators',
          'Market sentiment'
        ],
        mitigation: [
          'Diversify investment portfolio',
          'Monitor market conditions',
          'Maintain adequate reserves'
        ],
        monitoring: [
          'Track market trends',
          'Monitor economic indicators',
          'Review quarterly'
        ],
        lastAssessed: '2024-01-15',
        nextAssessment: '2024-04-15'
      }
    ];
    
    return mockAssessments;
  }

  // Data Visualization
  static async createDataVisualization(config: any): Promise<DataVisualization> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: Date.now().toString(),
      title: config.title || 'Market Data Visualization',
      type: config.type || 'chart',
      data: config.data || {},
      config: {
        width: config.width || 800,
        height: config.height || 600,
        theme: config.theme || 'light',
        colors: config.colors || ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
        animations: config.animations || true,
        responsive: config.responsive || true,
        exportFormats: config.exportFormats || ['png', 'svg', 'pdf']
      },
      filters: config.filters || [],
      interactions: config.interactions || [],
      isPublic: config.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Market Intelligence Dashboard
  static async createDashboard(config: any): Promise<MarketIntelligenceDashboard> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Date.now().toString(),
      userId: config.userId || 'user-1',
      title: config.title || 'Market Intelligence Dashboard',
      widgets: config.widgets || [],
      layout: {
        columns: config.layout?.columns || 4,
        rows: config.layout?.rows || 3,
        gap: config.layout?.gap || 16,
        padding: config.layout?.padding || 16,
        responsive: config.layout?.responsive || true
      },
      filters: config.filters || [],
      refreshInterval: config.refreshInterval || 60,
      isPublic: config.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Utility Functions
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  static formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  static getTrendColor(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }

  static getRiskColor(risk: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  static getImpactColor(impact: 'low' | 'medium' | 'high' | 'critical'): string {
    switch (impact) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  static calculateMarketHealth(metrics: {
    demandScore: number;
    supplyScore: number;
    priceChange: number;
    daysOnMarket: number;
  }): 'healthy' | 'overheated' | 'cooling' | 'declining' {
    const { demandScore, supplyScore, priceChange, daysOnMarket } = metrics;
    
    if (demandScore > 80 && supplyScore < 60 && priceChange > 5) {
      return 'overheated';
    } else if (demandScore < 40 && supplyScore > 80 && priceChange < -5) {
      return 'declining';
    } else if (demandScore < 60 && supplyScore > 60 && priceChange < 2) {
      return 'cooling';
    } else {
      return 'healthy';
    }
  }

  static generateMarketInsights(marketData: MarketData[]): string[] {
    const insights: string[] = [];
    
    if (marketData.length === 0) return insights;
    
    const avgPriceChange = marketData.reduce((sum, data) => sum + data.priceChange, 0) / marketData.length;
    const avgDaysOnMarket = marketData.reduce((sum, data) => sum + data.daysOnMarket, 0) / marketData.length;
    const avgInventory = marketData.reduce((sum, data) => sum + data.inventoryLevel, 0) / marketData.length;
    
    if (avgPriceChange > 5) {
      insights.push('Strong price growth indicates a seller\'s market');
    } else if (avgPriceChange < -2) {
      insights.push('Price decline suggests a buyer\'s market');
    }
    
    if (avgDaysOnMarket < 30) {
      insights.push('Fast-moving market with high demand');
    } else if (avgDaysOnMarket > 60) {
      insights.push('Slower market with extended listing periods');
    }
    
    if (avgInventory < 4) {
      insights.push('Low inventory creating competitive conditions');
    } else if (avgInventory > 8) {
      insights.push('High inventory providing buyer options');
    }
    
    return insights;
  }
}
