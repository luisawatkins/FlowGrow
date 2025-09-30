import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock neighborhood data (replace with actual database/API integration)
const mockNeighborhoods = new Map([
  ['1', {
    id: '1',
    name: 'Downtown District',
    overview: 'Vibrant urban neighborhood with excellent amenities',
    walkScore: 92,
    transitScore: 88,
    crimeRate: 15,
    medianHomePrice: 750000,
    priceHistory: [
      { year: 2020, price: 650000 },
      { year: 2021, price: 680000 },
      { year: 2022, price: 720000 },
      { year: 2023, price: 750000 },
    ],
    schools: [
      {
        id: '1',
        name: 'Downtown Elementary',
        type: 'Public',
        grades: 'K-5',
        rating: 8.5,
        distance: 0.3,
        students: 450,
        reviews: {
          count: 124,
          average: 4.2,
        },
      },
      {
        id: '2',
        name: 'City High School',
        type: 'Public',
        grades: '9-12',
        rating: 9.0,
        distance: 0.8,
        students: 1200,
        reviews: {
          count: 256,
          average: 4.5,
        },
      },
    ],
    transportation: {
      publicTransit: [
        {
          type: 'Subway Station',
          name: 'Downtown Central',
          distance: 0.2,
          lines: ['Red', 'Blue'],
        },
        {
          type: 'Bus Stop',
          name: 'Main St & 5th Ave',
          distance: 0.1,
          lines: ['10', '15', '22'],
        },
      ],
      commuteTimes: [
        {
          destination: 'Financial District',
          time: 15,
          mode: 'transit',
        },
        {
          destination: 'Airport',
          time: 45,
          mode: 'driving',
        },
      ],
    },
    amenities: {
      shopping: [
        {
          name: 'City Center Mall',
          type: 'Shopping Mall',
          rating: 4.2,
          distance: 0.4,
          reviews: 1250,
        },
        {
          name: 'Whole Foods Market',
          type: 'Grocery Store',
          rating: 4.5,
          distance: 0.3,
          reviews: 850,
        },
      ],
      healthcare: [
        {
          name: 'Downtown Medical Center',
          type: 'Hospital',
          rating: 4.3,
          distance: 0.6,
          reviews: 980,
        },
        {
          name: 'City Dental Care',
          type: 'Dental Clinic',
          rating: 4.8,
          distance: 0.4,
          reviews: 320,
        },
      ],
      dining: [
        {
          name: 'The Urban Kitchen',
          type: 'Restaurant',
          rating: 4.6,
          distance: 0.2,
          reviews: 750,
        },
        {
          name: 'Café Central',
          type: 'Café',
          rating: 4.4,
          distance: 0.1,
          reviews: 420,
        },
      ],
      recreation: [
        {
          name: 'Central Park',
          type: 'Park',
          rating: 4.7,
          distance: 0.5,
          reviews: 2100,
        },
        {
          name: 'City Fitness Center',
          type: 'Gym',
          rating: 4.3,
          distance: 0.3,
          reviews: 560,
        },
      ],
    },
    demographics: {
      population: 25000,
      medianAge: 34,
      medianIncome: 85000,
      ageDistribution: [
        { range: '0-17', percentage: 15 },
        { range: '18-34', percentage: 35 },
        { range: '35-54', percentage: 30 },
        { range: '55+', percentage: 20 },
      ],
      householdTypes: [
        { name: 'Single', percentage: 45 },
        { name: 'Married', percentage: 35 },
        { name: 'Family', percentage: 15 },
        { name: 'Other', percentage: 5 },
      ],
    },
  }],
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    // Simulate database/API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const neighborhood = mockNeighborhoods.get(params.propertyId);
    
    if (!neighborhood) {
      return NextResponse.json(
        { error: 'Neighborhood information not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(neighborhood);
  } catch (error) {
    console.error('Error fetching neighborhood info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch neighborhood information' },
      { status: 500 }
    );
  }
}
