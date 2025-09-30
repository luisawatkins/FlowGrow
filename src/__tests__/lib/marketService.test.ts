// Market Service Test Suite

import { marketService } from '@/lib/marketService';
import { 
  MarketAnalysisRequest, 
  MarketDataRequest, 
  MarketInsightFilter,
  MarketOpportunityFilter,
  MarketDataType,
  PropertyType,
  MarketType,
  InsightType,
  OpportunityType,
  RiskLevel,
  TimeHorizon
} from '@/types/market';

describe('MarketService', () => {
  beforeEach(() => {
    // Reset service state before each test
    jest.clearAllMocks();
  });

  describe('Market Data Operations', () => {
    it('should get market data for a location', async () => {
      const request: MarketDataRequest = {
        location: 'San Francisco, CA',
        dataType: MarketDataType.MEDIAN_PRICE,
        propertyType: PropertyType.SINGLE_FAMILY
      };

      const response = await marketService.getMarketData(request);

      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.trend).toBeDefined();
      expect(response.summary).toBeDefined();
      expect(response.summary.currentValue).toBeGreaterThan(0);
      expect(response.summary.changePercent).toBeDefined();
      expect(response.summary.direction).toBeDefined();
      expect(response.summary.confidence).toBeGreaterThan(0);
    });

    it('should get market data with time range', async () => {
      const request: MarketDataRequest = {
        location: 'San Francisco, CA',
        dataType: MarketDataType.AVERAGE_PRICE,
        timeRange: {
          start: new Date('2023-01-01'),
          end: new Date('2024-01-01')
        }
      };

      const response = await marketService.getMarketData(request);

      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(response.trend).toBeDefined();
    });

    it('should throw error for missing location', async () => {
      const request: MarketDataRequest = {
        location: '',
        dataType: MarketDataType.MEDIAN_PRICE
      };

      await expect(marketService.getMarketData(request)).rejects.toThrow();
    });
  });

  describe('Market Analysis Operations', () => {
    it('should get comprehensive market analysis', async () => {
      const request: MarketAnalysisRequest = {
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        marketType: MarketType.RESIDENTIAL,
        includeForecast: true,
        includeInsights: true,
        includeComparisons: true
      };

      const analysis = await marketService.getMarketAnalysis(request);

      expect(analysis).toBeDefined();
      expect(analysis.trends).toBeDefined();
      expect(analysis.insights).toBeDefined();
      expect(analysis.comparisons).toBeDefined();
      expect(analysis.opportunities).toBeDefined();
      expect(analysis.report).toBeDefined();
    });

    it('should get market analysis with minimal parameters', async () => {
      const request: MarketAnalysisRequest = {
        location: 'San Francisco, CA'
      };

      const analysis = await marketService.getMarketAnalysis(request);

      expect(analysis).toBeDefined();
      expect(analysis.trends).toBeDefined();
      expect(analysis.insights).toBeDefined();
      expect(analysis.comparisons).toBeDefined();
      expect(analysis.opportunities).toBeDefined();
      expect(analysis.report).toBeDefined();
    });

    it('should throw error for missing location in analysis', async () => {
      const request: MarketAnalysisRequest = {
        location: ''
      };

      await expect(marketService.getMarketAnalysis(request)).rejects.toThrow();
    });
  });

  describe('Market Trends Operations', () => {
    it('should get market trends for a location', async () => {
      const trends = await marketService.getMarketTrends('San Francisco, CA');

      expect(trends).toBeDefined();
      expect(Array.isArray(trends)).toBe(true);
    });

    it('should get market trends filtered by property type', async () => {
      const trends = await marketService.getMarketTrends('San Francisco, CA', PropertyType.SINGLE_FAMILY);

      expect(trends).toBeDefined();
      expect(Array.isArray(trends)).toBe(true);
    });

    it('should return empty array for non-existent location', async () => {
      const trends = await marketService.getMarketTrends('Non-existent City');

      expect(trends).toBeDefined();
      expect(Array.isArray(trends)).toBe(true);
      expect(trends.length).toBe(0);
    });
  });

  describe('Market Insights Operations', () => {
    it('should get market insights without filter', async () => {
      const insights = await marketService.getMarketInsights({});

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should get market insights with location filter', async () => {
      const filter: MarketInsightFilter = {
        location: 'San Francisco, CA'
      };

      const insights = await marketService.getMarketInsights(filter);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should get market insights with multiple filters', async () => {
      const filter: MarketInsightFilter = {
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        insightType: InsightType.MARKET_HOT,
        impact: 'high' as any,
        minConfidence: 0.8
      };

      const insights = await marketService.getMarketInsights(filter);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should filter insights by tags', async () => {
      const filter: MarketInsightFilter = {
        tags: ['seller-market', 'high-demand']
      };

      const insights = await marketService.getMarketInsights(filter);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });
  });

  describe('Market Comparisons Operations', () => {
    it('should get market comparisons for a location', async () => {
      const comparisons = await marketService.getMarketComparisons('San Francisco, CA');

      expect(comparisons).toBeDefined();
      expect(Array.isArray(comparisons)).toBe(true);
    });

    it('should get market comparisons filtered by property type', async () => {
      const comparisons = await marketService.getMarketComparisons('San Francisco, CA', PropertyType.SINGLE_FAMILY);

      expect(comparisons).toBeDefined();
      expect(Array.isArray(comparisons)).toBe(true);
    });

    it('should return empty array for non-existent location', async () => {
      const comparisons = await marketService.getMarketComparisons('Non-existent City');

      expect(comparisons).toBeDefined();
      expect(Array.isArray(comparisons)).toBe(true);
      expect(comparisons.length).toBe(0);
    });
  });

  describe('Investment Opportunities Operations', () => {
    it('should get investment opportunities without filter', async () => {
      const opportunities = await marketService.getInvestmentOpportunities({});

      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
    });

    it('should get investment opportunities with location filter', async () => {
      const filter: MarketOpportunityFilter = {
        location: 'San Francisco, CA'
      };

      const opportunities = await marketService.getInvestmentOpportunities(filter);

      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
    });

    it('should get investment opportunities with multiple filters', async () => {
      const filter: MarketOpportunityFilter = {
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        opportunityType: OpportunityType.UNDERVALUED,
        riskLevel: RiskLevel.MEDIUM,
        timeHorizon: TimeHorizon.SHORT_TERM,
        minPotentialReturn: 10
      };

      const opportunities = await marketService.getInvestmentOpportunities(filter);

      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
    });

    it('should filter opportunities by risk level', async () => {
      const filter: MarketOpportunityFilter = {
        riskLevel: RiskLevel.LOW
      };

      const opportunities = await marketService.getInvestmentOpportunities(filter);

      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
    });
  });

  describe('Market Report Operations', () => {
    it('should generate a market report', async () => {
      const reportData = {
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        reportType: 'market_overview' as any,
        title: 'Test Market Report',
        summary: 'Test summary',
        sections: [],
        insights: [],
        trends: [],
        comparisons: [],
        opportunities: [],
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        confidence: 0.85
      };

      const report = await marketService.generateMarketReport(reportData);

      expect(report).toBeDefined();
      expect(report.id).toBeDefined();
      expect(report.title).toBe(reportData.title);
      expect(report.summary).toBe(reportData.summary);
      expect(report.sections).toBeDefined();
      expect(Array.isArray(report.sections)).toBe(true);
    });

    it('should get a market report by ID', async () => {
      const report = await marketService.getMarketReport('test-report-id');

      expect(report).toBeDefined();
      expect(report.id).toBeDefined();
      expect(report.title).toBeDefined();
      expect(report.summary).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle market data errors gracefully', async () => {
      const invalidRequest = {
        location: '',
        dataType: 'invalid_type' as any
      };

      await expect(marketService.getMarketData(invalidRequest as any)).rejects.toThrow();
    });

    it('should handle market analysis errors gracefully', async () => {
      const invalidRequest = {
        location: ''
      };

      await expect(marketService.getMarketAnalysis(invalidRequest as any)).rejects.toThrow();
    });

    it('should handle market insights errors gracefully', async () => {
      const invalidFilter = {
        minConfidence: -1
      };

      await expect(marketService.getMarketInsights(invalidFilter as any)).rejects.toThrow();
    });

    it('should handle investment opportunities errors gracefully', async () => {
      const invalidFilter = {
        minPotentialReturn: -100
      };

      await expect(marketService.getInvestmentOpportunities(invalidFilter as any)).rejects.toThrow();
    });
  });

  describe('Data Validation', () => {
    it('should validate market data request parameters', async () => {
      const request: MarketDataRequest = {
        location: 'San Francisco, CA',
        dataType: MarketDataType.MEDIAN_PRICE
      };

      const response = await marketService.getMarketData(request);

      expect(response.data).toBeDefined();
      expect(response.trend).toBeDefined();
      expect(response.summary).toBeDefined();
    });

    it('should validate market analysis request parameters', async () => {
      const request: MarketAnalysisRequest = {
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        marketType: MarketType.RESIDENTIAL
      };

      const analysis = await marketService.getMarketAnalysis(request);

      expect(analysis.trends).toBeDefined();
      expect(analysis.insights).toBeDefined();
      expect(analysis.comparisons).toBeDefined();
      expect(analysis.opportunities).toBeDefined();
      expect(analysis.report).toBeDefined();
    });

    it('should validate insight filter parameters', async () => {
      const filter: MarketInsightFilter = {
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        insightType: InsightType.MARKET_HOT,
        impact: 'high' as any,
        minConfidence: 0.8,
        tags: ['test-tag']
      };

      const insights = await marketService.getMarketInsights(filter);

      expect(insights).toBeDefined();
      expect(Array.isArray(insights)).toBe(true);
    });

    it('should validate opportunity filter parameters', async () => {
      const filter: MarketOpportunityFilter = {
        location: 'San Francisco, CA',
        propertyType: PropertyType.SINGLE_FAMILY,
        opportunityType: OpportunityType.UNDERVALUED,
        riskLevel: RiskLevel.MEDIUM,
        timeHorizon: TimeHorizon.SHORT_TERM,
        minPotentialReturn: 10,
        maxRiskLevel: RiskLevel.HIGH
      };

      const opportunities = await marketService.getInvestmentOpportunities(filter);

      expect(opportunities).toBeDefined();
      expect(Array.isArray(opportunities)).toBe(true);
    });
  });
});
