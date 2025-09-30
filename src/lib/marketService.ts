// Property Market Analysis Service

import { 
  MarketData, 
  MarketTrend, 
  MarketInsight, 
  MarketComparison, 
  InvestmentOpportunity,
  MarketReport,
  MarketAnalysisRequest,
  MarketAnalysisResponse,
  MarketDataRequest,
  MarketDataResponse,
  MarketDataFilter,
  MarketInsightFilter,
  MarketOpportunityFilter,
  MarketType,
  MarketDataType,
  PropertyType,
  TrendType,
  TimePeriod,
  TrendDirection,
  InsightType,
  ImpactLevel,
  ComparisonType,
  OpportunityType,
  RiskLevel,
  TimeHorizon,
  ReportType,
  ChartType,
  DataQuality,
  MarketError
} from '@/types/market';

// Mock data for development
const mockMarketData: MarketData[] = [
  {
    id: 'data-1',
    location: 'San Francisco, CA',
    region: 'Bay Area',
    state: 'CA',
    zipCode: '94102',
    marketType: MarketType.RESIDENTIAL,
    dataType: MarketDataType.MEDIAN_PRICE,
    value: 1200000,
    unit: 'USD',
    date: new Date('2024-01-01'),
    source: 'MLS Data',
    confidence: 0.95,
    metadata: {
      sampleSize: 150,
      methodology: 'Median of all sales',
      dataQuality: DataQuality.EXCELLENT
    }
  },
  {
    id: 'data-2',
    location: 'San Francisco, CA',
    region: 'Bay Area',
    state: 'CA',
    zipCode: '94102',
    marketType: MarketType.RESIDENTIAL,
    dataType: MarketDataType.AVERAGE_PRICE,
    value: 1350000,
    unit: 'USD',
    date: new Date('2024-01-01'),
    source: 'MLS Data',
    confidence: 0.92,
    metadata: {
      sampleSize: 150,
      methodology: 'Average of all sales',
      dataQuality: DataQuality.EXCELLENT
    }
  },
  {
    id: 'data-3',
    location: 'San Francisco, CA',
    region: 'Bay Area',
    state: 'CA',
    zipCode: '94102',
    marketType: MarketType.RESIDENTIAL,
    dataType: MarketDataType.DAYS_ON_MARKET,
    value: 25,
    unit: 'days',
    date: new Date('2024-01-01'),
    source: 'MLS Data',
    confidence: 0.88,
    metadata: {
      sampleSize: 150,
      methodology: 'Average days on market',
      dataQuality: DataQuality.GOOD
    }
  }
];

const mockMarketTrends: MarketTrend[] = [
  {
    id: 'trend-1',
    location: 'San Francisco, CA',
    propertyType: PropertyType.SINGLE_FAMILY,
    trendType: TrendType.PRICE_TREND,
    period: TimePeriod.MONTHLY,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    currentValue: 1200000,
    previousValue: 1150000,
    changePercent: 4.35,
    changeAmount: 50000,
    direction: TrendDirection.RISING,
    confidence: 0.92,
    dataPoints: [
      { date: new Date('2023-01-01'), value: 1150000, source: 'MLS', confidence: 0.95 },
      { date: new Date('2023-06-01'), value: 1180000, source: 'MLS', confidence: 0.93 },
      { date: new Date('2024-01-01'), value: 1200000, source: 'MLS', confidence: 0.95 }
    ],
    forecast: {
      id: 'forecast-1',
      trendId: 'trend-1',
      forecastType: 'short_term' as any,
      period: TimePeriod.MONTHLY,
      predictedValue: 1220000,
      confidence: 0.78,
      upperBound: 1250000,
      lowerBound: 1190000,
      methodology: 'Linear regression with seasonal adjustment',
      assumptions: ['Current market conditions continue', 'No major economic shocks'],
      lastUpdated: new Date('2024-01-01')
    }
  }
];

const mockMarketInsights: MarketInsight[] = [
  {
    id: 'insight-1',
    location: 'San Francisco, CA',
    propertyType: PropertyType.SINGLE_FAMILY,
    insightType: InsightType.MARKET_HOT,
    title: 'Strong Seller\'s Market',
    description: 'Properties are selling 15% above asking price with multiple offers. Average days on market is only 25 days.',
    impact: ImpactLevel.HIGH,
    confidence: 0.88,
    source: 'Market Analysis',
    date: new Date('2024-01-15'),
    tags: ['seller-market', 'high-demand', 'quick-sales'],
    relatedTrends: ['trend-1'],
    recommendations: [
      'Consider listing properties at market value',
      'Prepare for multiple offer scenarios',
      'Focus on property presentation and staging'
    ]
  },
  {
    id: 'insight-2',
    location: 'San Francisco, CA',
    propertyType: PropertyType.SINGLE_FAMILY,
    insightType: InsightType.INVESTMENT_OPPORTUNITY,
    title: 'Rental Yield Opportunity',
    description: 'Current rental yields are 4.2% with strong tenant demand. Properties near tech hubs show 5.5% yields.',
    impact: ImpactLevel.MEDIUM,
    confidence: 0.82,
    source: 'Rental Market Analysis',
    date: new Date('2024-01-10'),
    tags: ['rental-yield', 'investment', 'tech-hubs'],
    relatedTrends: ['trend-1'],
    recommendations: [
      'Consider properties near major tech companies',
      'Focus on 2-3 bedroom units for optimal yield',
      'Research local rental regulations'
    ]
  }
];

const mockMarketComparisons: MarketComparison[] = [
  {
    id: 'comparison-1',
    location: 'San Francisco, CA',
    propertyType: PropertyType.SINGLE_FAMILY,
    comparisonType: ComparisonType.CITY,
    benchmark: 'San Francisco Average',
    currentValue: 1200000,
    benchmarkValue: 1100000,
    difference: 100000,
    differencePercent: 9.09,
    rank: 15,
    totalProperties: 100,
    percentile: 85,
    date: new Date('2024-01-01')
  }
];

const mockInvestmentOpportunities: InvestmentOpportunity[] = [
  {
    id: 'opportunity-1',
    propertyId: 'property-1',
    location: 'San Francisco, CA',
    opportunityType: OpportunityType.UNDERVALUED,
    title: 'Distressed Property Opportunity',
    description: 'Property listed 20% below market value due to needed repairs. Estimated repair costs: $50,000.',
    potentialReturn: 25.5,
    riskLevel: RiskLevel.MEDIUM,
    timeHorizon: TimeHorizon.SHORT_TERM,
    confidence: 0.75,
    factors: [
      {
        factor: 'Market Appreciation',
        impact: ImpactLevel.HIGH,
        description: 'Strong market growth expected',
        weight: 0.4
      },
      {
        factor: 'Repair Costs',
        impact: ImpactLevel.MEDIUM,
        description: 'Moderate renovation required',
        weight: 0.3
      },
      {
        factor: 'Location Premium',
        impact: ImpactLevel.HIGH,
        description: 'Prime location with high demand',
        weight: 0.3
      }
    ],
    recommendations: [
      'Get detailed inspection before purchase',
      'Obtain multiple contractor quotes',
      'Consider financing options for repairs',
      'Research local permit requirements'
    ],
    date: new Date('2024-01-15')
  }
];

class MarketService {
  private marketData: MarketData[] = [...mockMarketData];
  private marketTrends: MarketTrend[] = [...mockMarketTrends];
  private marketInsights: MarketInsight[] = [...mockMarketInsights];
  private marketComparisons: MarketComparison[] = [...mockMarketComparisons];
  private investmentOpportunities: InvestmentOpportunity[] = [...mockInvestmentOpportunities];

  // Market Data Operations
  async getMarketData(request: MarketDataRequest): Promise<MarketDataResponse> {
    try {
      const filter: MarketDataFilter = {
        location: request.location,
        dataType: request.dataType,
        propertyType: request.propertyType,
        dateFrom: request.timeRange?.start,
        dateTo: request.timeRange?.end
      };

      const filteredData = this.applyMarketDataFilter(this.marketData, filter);
      const trend = this.generateTrendFromData(filteredData, request.dataType);

      const currentValue = filteredData.length > 0 ? filteredData[filteredData.length - 1].value : 0;
      const previousValue = filteredData.length > 1 ? filteredData[filteredData.length - 2].value : currentValue;
      const changePercent = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

      return {
        data: filteredData,
        trend,
        summary: {
          currentValue,
          changePercent,
          direction: this.getTrendDirection(changePercent),
          confidence: filteredData.length > 0 ? filteredData[filteredData.length - 1].confidence : 0
        }
      };
    } catch (error) {
      throw this.handleError('GET_MARKET_DATA_FAILED', 'Failed to get market data', error);
    }
  }

  async getMarketTrends(location: string, propertyType?: PropertyType): Promise<MarketTrend[]> {
    try {
      let filteredTrends = this.marketTrends.filter(trend => trend.location === location);
      
      if (propertyType) {
        filteredTrends = filteredTrends.filter(trend => trend.propertyType === propertyType);
      }

      return filteredTrends.sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
    } catch (error) {
      throw this.handleError('GET_MARKET_TRENDS_FAILED', 'Failed to get market trends', error);
    }
  }

  // Market Analysis Operations
  async getMarketAnalysis(request: MarketAnalysisRequest): Promise<MarketAnalysisResponse> {
    try {
      const trends = await this.getMarketTrends(request.location, request.propertyType);
      const insights = await this.getMarketInsights({
        location: request.location,
        propertyType: request.propertyType
      });
      const comparisons = await this.getMarketComparisons(request.location, request.propertyType);
      const opportunities = await this.getInvestmentOpportunities({
        location: request.location,
        propertyType: request.propertyType
      });

      const report = await this.generateMarketReport({
        location: request.location,
        propertyType: request.propertyType || PropertyType.SINGLE_FAMILY,
        reportType: ReportType.MARKET_OVERVIEW,
        title: `Market Analysis: ${request.location}`,
        summary: `Comprehensive market analysis for ${request.location}`,
        sections: [],
        insights,
        trends,
        comparisons,
        opportunities,
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        confidence: 0.85
      });

      return {
        trends,
        insights,
        comparisons,
        opportunities,
        report
      };
    } catch (error) {
      throw this.handleError('GET_MARKET_ANALYSIS_FAILED', 'Failed to get market analysis', error);
    }
  }

  // Market Insights Operations
  async getMarketInsights(filter: MarketInsightFilter): Promise<MarketInsight[]> {
    try {
      let filteredInsights = this.marketInsights;

      if (filter.location) {
        filteredInsights = filteredInsights.filter(insight => insight.location === filter.location);
      }

      if (filter.propertyType) {
        filteredInsights = filteredInsights.filter(insight => insight.propertyType === filter.propertyType);
      }

      if (filter.insightType) {
        filteredInsights = filteredInsights.filter(insight => insight.insightType === filter.insightType);
      }

      if (filter.impact) {
        filteredInsights = filteredInsights.filter(insight => insight.impact === filter.impact);
      }

      if (filter.minConfidence) {
        filteredInsights = filteredInsights.filter(insight => insight.confidence >= filter.minConfidence!);
      }

      if (filter.tags && filter.tags.length > 0) {
        filteredInsights = filteredInsights.filter(insight =>
          filter.tags!.some(tag => insight.tags.includes(tag))
        );
      }

      return filteredInsights.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      throw this.handleError('GET_MARKET_INSIGHTS_FAILED', 'Failed to get market insights', error);
    }
  }

  // Market Comparisons Operations
  async getMarketComparisons(location: string, propertyType?: PropertyType): Promise<MarketComparison[]> {
    try {
      let filteredComparisons = this.marketComparisons.filter(comparison => comparison.location === location);

      if (propertyType) {
        filteredComparisons = filteredComparisons.filter(comparison => comparison.propertyType === propertyType);
      }

      return filteredComparisons.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      throw this.handleError('GET_MARKET_COMPARISONS_FAILED', 'Failed to get market comparisons', error);
    }
  }

  // Investment Opportunities Operations
  async getInvestmentOpportunities(filter: MarketOpportunityFilter): Promise<InvestmentOpportunity[]> {
    try {
      let filteredOpportunities = this.investmentOpportunities;

      if (filter.location) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.location === filter.location);
      }

      if (filter.propertyType) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.propertyType === filter.propertyType);
      }

      if (filter.opportunityType) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.opportunityType === filter.opportunityType);
      }

      if (filter.riskLevel) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.riskLevel === filter.riskLevel);
      }

      if (filter.timeHorizon) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.timeHorizon === filter.timeHorizon);
      }

      if (filter.minPotentialReturn) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.potentialReturn >= filter.minPotentialReturn!);
      }

      return filteredOpportunities.sort((a, b) => b.potentialReturn - a.potentialReturn);
    } catch (error) {
      throw this.handleError('GET_INVESTMENT_OPPORTUNITIES_FAILED', 'Failed to get investment opportunities', error);
    }
  }

  // Market Report Operations
  async generateMarketReport(reportData: Omit<MarketReport, 'id'>): Promise<MarketReport> {
    try {
      const report: MarketReport = {
        id: `report-${Date.now()}`,
        ...reportData
      };

      // Generate report sections based on data
      report.sections = this.generateReportSections(report);

      return report;
    } catch (error) {
      throw this.handleError('GENERATE_MARKET_REPORT_FAILED', 'Failed to generate market report', error);
    }
  }

  async getMarketReport(reportId: string): Promise<MarketReport> {
    try {
      // In a real implementation, this would fetch from database
      // For now, we'll generate a new report
      const report = await this.generateMarketReport({
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        reportType: ReportType.MARKET_OVERVIEW,
        title: 'Market Report',
        summary: 'Generated market report',
        sections: [],
        insights: [],
        trends: [],
        comparisons: [],
        opportunities: [],
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        confidence: 0.85
      });

      return report;
    } catch (error) {
      throw this.handleError('GET_MARKET_REPORT_FAILED', 'Failed to get market report', error);
    }
  }

  // Helper Methods
  private applyMarketDataFilter(data: MarketData[], filter: MarketDataFilter): MarketData[] {
    return data.filter(item => {
      if (filter.location && item.location !== filter.location) return false;
      if (filter.propertyType && item.marketType !== filter.propertyType) return false;
      if (filter.dataType && item.dataType !== filter.dataType) return false;
      if (filter.dateFrom && item.date < filter.dateFrom) return false;
      if (filter.dateTo && item.date > filter.dateTo) return false;
      if (filter.source && item.source !== filter.source) return false;
      if (filter.minConfidence && item.confidence < filter.minConfidence) return false;
      return true;
    });
  }

  private generateTrendFromData(data: MarketData[], dataType: MarketDataType): MarketTrend {
    if (data.length === 0) {
      throw new Error('No data available to generate trend');
    }

    const sortedData = data.sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstValue = sortedData[0].value;
    const lastValue = sortedData[sortedData.length - 1].value;
    const changePercent = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

    return {
      id: `trend-${Date.now()}`,
      location: sortedData[0].location,
      propertyType: PropertyType.SINGLE_FAMILY,
      trendType: this.getTrendTypeFromDataType(dataType),
      period: TimePeriod.MONTHLY,
      startDate: sortedData[0].date,
      endDate: sortedData[sortedData.length - 1].date,
      currentValue: lastValue,
      previousValue: firstValue,
      changePercent,
      changeAmount: lastValue - firstValue,
      direction: this.getTrendDirection(changePercent),
      confidence: sortedData.reduce((sum, item) => sum + item.confidence, 0) / sortedData.length,
      dataPoints: sortedData.map(item => ({
        date: item.date,
        value: item.value,
        source: item.source,
        confidence: item.confidence
      }))
    };
  }

  private getTrendTypeFromDataType(dataType: MarketDataType): TrendType {
    const typeMap: Record<MarketDataType, TrendType> = {
      [MarketDataType.MEDIAN_PRICE]: TrendType.PRICE_TREND,
      [MarketDataType.AVERAGE_PRICE]: TrendType.PRICE_TREND,
      [MarketDataType.PRICE_PER_SQFT]: TrendType.PRICE_TREND,
      [MarketDataType.SALES_VOLUME]: TrendType.VOLUME_TREND,
      [MarketDataType.DAYS_ON_MARKET]: TrendType.MARKET_ACTIVITY,
      [MarketDataType.INVENTORY_LEVEL]: TrendType.INVENTORY_TREND,
      [MarketDataType.APPRECIATION_RATE]: TrendType.APPRECIATION_TREND,
      [MarketDataType.RENTAL_YIELD]: TrendType.RENTAL_TREND,
      [MarketDataType.CAP_RATE]: TrendType.RENTAL_TREND
    };
    return typeMap[dataType] || TrendType.PRICE_TREND;
  }

  private getTrendDirection(changePercent: number): TrendDirection {
    if (changePercent > 5) return TrendDirection.RISING;
    if (changePercent < -5) return TrendDirection.FALLING;
    if (Math.abs(changePercent) < 2) return TrendDirection.STABLE;
    return TrendDirection.VOLATILE;
  }

  private generateReportSections(report: MarketReport): any[] {
    const sections = [];

    if (report.trends.length > 0) {
      sections.push({
        id: 'trends-section',
        title: 'Market Trends',
        content: 'Analysis of current market trends and patterns.',
        charts: [
          {
            id: 'trends-chart',
            type: ChartType.LINE,
            title: 'Price Trends Over Time',
            data: report.trends[0]?.dataPoints || [],
            options: { responsive: true }
          }
        ],
        tables: [],
        order: 1
      });
    }

    if (report.insights.length > 0) {
      sections.push({
        id: 'insights-section',
        title: 'Market Insights',
        content: 'Key insights and recommendations for the market.',
        charts: [],
        tables: [
          {
            id: 'insights-table',
            title: 'Market Insights Summary',
            headers: ['Type', 'Impact', 'Confidence', 'Date'],
            rows: report.insights.map(insight => [
              insight.insightType,
              insight.impact,
              `${(insight.confidence * 100).toFixed(1)}%`,
              insight.date.toLocaleDateString()
            ])
          }
        ],
        order: 2
      });
    }

    if (report.opportunities.length > 0) {
      sections.push({
        id: 'opportunities-section',
        title: 'Investment Opportunities',
        content: 'Identified investment opportunities in the market.',
        charts: [],
        tables: [
          {
            id: 'opportunities-table',
            title: 'Investment Opportunities',
            headers: ['Type', 'Potential Return', 'Risk Level', 'Time Horizon'],
            rows: report.opportunities.map(opp => [
              opp.opportunityType,
              `${opp.potentialReturn.toFixed(1)}%`,
              opp.riskLevel,
              opp.timeHorizon
            ])
          }
        ],
        order: 3
      });
    }

    return sections;
  }

  private handleError(code: string, message: string, details?: any): MarketError {
    return {
      code,
      message,
      details
    };
  }
}

export const marketService = new MarketService();
