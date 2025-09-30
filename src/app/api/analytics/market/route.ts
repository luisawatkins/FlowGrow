import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface MarketTrend {
  date: string;
  averagePrice: number;
  medianPrice: number;
  totalListings: number;
  averageDaysOnMarket: number;
  pricePerSqFt: number;
}

interface PriceRange {
  range: string;
  count: number;
  percentage: number;
}

interface PropertyType {
  type: string;
  count: number;
  percentage: number;
  averagePrice: number;
}

interface MarketAnalytics {
  trends: MarketTrend[];
  priceRanges: PriceRange[];
  propertyTypes: PropertyType[];
  summary: {
    totalListings: number;
    averagePrice: number;
    medianPrice: number;
    averageDaysOnMarket: number;
    yearOverYearChange: number;
    monthOverMonthChange: number;
  };
}

// Mock market data
const generateMarketData = (): MarketAnalytics => {
  const today = new Date();
  const trends: MarketTrend[] = [];

  // Generate 12 months of trend data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);

    // Generate realistic but mock data
    const basePrice = 500000;
    const variation = Math.sin(i / 2) * 50000;
    const averagePrice = basePrice + variation + Math.random() * 20000;

    trends.push({
      date: date.toISOString().split('T')[0],
      averagePrice,
      medianPrice: averagePrice * 0.95,
      totalListings: 100 + Math.floor(Math.random() * 50),
      averageDaysOnMarket: 30 + Math.floor(Math.random() * 15),
      pricePerSqFt: 250 + Math.floor(Math.random() * 50),
    });
  }

  const priceRanges: PriceRange[] = [
    {
      range: 'Under $300k',
      count: 150,
      percentage: 15,
    },
    {
      range: '$300k - $500k',
      count: 300,
      percentage: 30,
    },
    {
      range: '$500k - $750k',
      count: 250,
      percentage: 25,
    },
    {
      range: '$750k - $1M',
      count: 200,
      percentage: 20,
    },
    {
      range: 'Over $1M',
      count: 100,
      percentage: 10,
    },
  ];

  const propertyTypes: PropertyType[] = [
    {
      type: 'Single Family',
      count: 500,
      percentage: 50,
      averagePrice: 600000,
    },
    {
      type: 'Condo',
      count: 200,
      percentage: 20,
      averagePrice: 400000,
    },
    {
      type: 'Townhouse',
      count: 150,
      percentage: 15,
      averagePrice: 450000,
    },
    {
      type: 'Multi-Family',
      count: 100,
      percentage: 10,
      averagePrice: 800000,
    },
    {
      type: 'Land',
      count: 50,
      percentage: 5,
      averagePrice: 300000,
    },
  ];

  const lastMonth = trends[trends.length - 1];
  const previousMonth = trends[trends.length - 2];
  const lastYear = trends[0];

  return {
    trends,
    priceRanges,
    propertyTypes,
    summary: {
      totalListings: 1000,
      averagePrice: lastMonth.averagePrice,
      medianPrice: lastMonth.medianPrice,
      averageDaysOnMarket: lastMonth.averageDaysOnMarket,
      yearOverYearChange:
        ((lastMonth.averagePrice - lastYear.averagePrice) /
          lastYear.averagePrice) *
        100,
      monthOverMonthChange:
        ((lastMonth.averagePrice - previousMonth.averagePrice) /
          previousMonth.averagePrice) *
        100,
    },
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');

    // In a real application, you would:
    // 1. Query real estate database
    // 2. Apply location and property type filters
    // 3. Calculate actual statistics
    // 4. Cache results for performance

    const marketData = generateMarketData();

    // Filter by property type if specified
    if (propertyType) {
      marketData.propertyTypes = marketData.propertyTypes.filter(
        (type) => type.type.toLowerCase() === propertyType.toLowerCase()
      );
    }

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error fetching market analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market analytics' },
      { status: 500 }
    );
  }
}
