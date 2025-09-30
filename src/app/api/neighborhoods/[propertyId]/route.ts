import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface School {
  id: string;
  name: string;
  type: 'elementary' | 'middle' | 'high' | 'private';
  rating: number;
  distance: number;
  grades: string;
  students: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface PointOfInterest {
  id: string;
  name: string;
  type: string;
  rating: number;
  distance: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface TransitStop {
  id: string;
  name: string;
  type: 'bus' | 'train' | 'subway';
  lines: string[];
  distance: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface NeighborhoodData {
  overview: {
    name: string;
    description: string;
    population: number;
    medianIncome: number;
    medianAge: number;
    crimeRate: 'low' | 'moderate' | 'high';
    walkScore: number;
    transitScore: number;
    bikeScore: number;
  };
  schools: {
    averageRating: number;
    schools: School[];
  };
  amenities: {
    categories: {
      name: string;
      count: number;
      items: PointOfInterest[];
    }[];
  };
  transit: {
    stops: TransitStop[];
    commuteTime: {
      driving: number;
      transit: number;
      walking: number;
      cycling: number;
    };
  };
  demographics: {
    ageDistribution: {
      range: string;
      percentage: number;
    }[];
    householdTypes: {
      type: string;
      percentage: number;
    }[];
    education: {
      level: string;
      percentage: number;
    }[];
  };
}

// Mock neighborhood data
const neighborhoods = new Map<string, NeighborhoodData>([
  ['1', {
    overview: {
      name: 'Downtown District',
      description: 'A vibrant urban neighborhood with easy access to restaurants, shopping, and entertainment.',
      population: 25000,
      medianIncome: 85000,
      medianAge: 34,
      crimeRate: 'low',
      walkScore: 92,
      transitScore: 88,
      bikeScore: 76,
    },
    schools: {
      averageRating: 8.2,
      schools: [
        {
          id: '1',
          name: 'Downtown Elementary',
          type: 'elementary',
          rating: 8.5,
          distance: 0.5,
          grades: 'K-5',
          students: 450,
          location: {
            lat: 40.7128,
            lng: -74.0060,
          },
        },
        {
          id: '2',
          name: 'City Middle School',
          type: 'middle',
          rating: 8.0,
          distance: 0.8,
          grades: '6-8',
          students: 600,
          location: {
            lat: 40.7138,
            lng: -74.0070,
          },
        },
        {
          id: '3',
          name: 'Urban High',
          type: 'high',
          rating: 8.1,
          distance: 1.2,
          grades: '9-12',
          students: 1200,
          location: {
            lat: 40.7148,
            lng: -74.0080,
          },
        },
      ],
    },
    amenities: {
      categories: [
        {
          name: 'Restaurants',
          count: 45,
          items: [
            {
              id: '1',
              name: 'The Urban Kitchen',
              type: 'restaurant',
              rating: 4.5,
              distance: 0.2,
              location: {
                lat: 40.7129,
                lng: -74.0061,
              },
            },
            // Add more restaurants...
          ],
        },
        {
          name: 'Shopping',
          count: 32,
          items: [
            {
              id: '2',
              name: 'City Mall',
              type: 'shopping',
              rating: 4.2,
              distance: 0.4,
              location: {
                lat: 40.7130,
                lng: -74.0062,
              },
            },
            // Add more shopping locations...
          ],
        },
        {
          name: 'Parks',
          count: 8,
          items: [
            {
              id: '3',
              name: 'Central Park',
              type: 'park',
              rating: 4.8,
              distance: 0.3,
              location: {
                lat: 40.7131,
                lng: -74.0063,
              },
            },
            // Add more parks...
          ],
        },
      ],
    },
    transit: {
      stops: [
        {
          id: '1',
          name: 'Downtown Station',
          type: 'subway',
          lines: ['A', 'B', 'C'],
          distance: 0.2,
          location: {
            lat: 40.7132,
            lng: -74.0064,
          },
        },
        {
          id: '2',
          name: 'City Bus Terminal',
          type: 'bus',
          lines: ['1', '2', '3'],
          distance: 0.3,
          location: {
            lat: 40.7133,
            lng: -74.0065,
          },
        },
      ],
      commuteTime: {
        driving: 20,
        transit: 25,
        walking: 45,
        cycling: 30,
      },
    },
    demographics: {
      ageDistribution: [
        { range: '0-17', percentage: 15 },
        { range: '18-34', percentage: 35 },
        { range: '35-54', percentage: 30 },
        { range: '55+', percentage: 20 },
      ],
      householdTypes: [
        { type: 'Single', percentage: 45 },
        { type: 'Married', percentage: 35 },
        { type: 'Family', percentage: 20 },
      ],
      education: [
        { level: 'High School', percentage: 20 },
        { level: 'Bachelor\'s', percentage: 45 },
        { level: 'Graduate', percentage: 35 },
      ],
    },
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const propertyId = params.propertyId;
    const neighborhoodData = neighborhoods.get(propertyId);

    if (!neighborhoodData) {
      return NextResponse.json(
        { error: 'Neighborhood data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(neighborhoodData);
  } catch (error) {
    console.error('Error fetching neighborhood data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch neighborhood data' },
      { status: 500 }
    );
  }
}
