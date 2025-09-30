import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Mock property database
const properties = new Map([
  ['1', {
    id: '1',
    title: 'Modern Downtown Apartment',
    price: 450000,
    imageUrl: '/images/properties/apartment1.jpg',
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    propertyType: 'Apartment',
    location: 'Downtown',
    yearBuilt: 2020,
    amenities: ['Parking', 'Gym', 'Pool'],
    walkScore: 85,
    transitScore: 90,
    schoolRating: 8,
    pricePerSqFt: 375,
    hoaFees: 350,
    propertyTax: 4500,
    utilities: {
      electric: 'Not included',
      water: 'Not included',
      gas: 'Not included',
      internet: 'Not included',
    },
    parking: {
      type: 'Garage',
      spaces: 1,
    },
  }],
  ['2', {
    id: '2',
    title: 'Suburban Family Home',
    price: 750000,
    imageUrl: '/images/properties/house1.jpg',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2500,
    propertyType: 'House',
    location: 'Suburbs',
    yearBuilt: 2015,
    amenities: ['Garage', 'Garden', 'Fireplace'],
    walkScore: 65,
    transitScore: 45,
    schoolRating: 9,
    pricePerSqFt: 300,
    hoaFees: 0,
    propertyTax: 7500,
    utilities: {
      electric: 'Not included',
      water: 'Not included',
      gas: 'Not included',
      internet: 'Not included',
    },
    parking: {
      type: 'Garage',
      spaces: 2,
    },
  }],
]);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { propertyIds } = await request.json();
    if (!Array.isArray(propertyIds) || propertyIds.length < 2) {
      return NextResponse.json(
        { error: 'At least two property IDs are required' },
        { status: 400 }
      );
    }

    // Get property details for comparison
    const comparisonData = propertyIds
      .map(id => properties.get(id))
      .filter(Boolean);

    if (comparisonData.length !== propertyIds.length) {
      return NextResponse.json(
        { error: 'One or more properties not found' },
        { status: 404 }
      );
    }

    // Calculate additional comparison metrics
    const enhancedData = comparisonData.map(property => ({
      ...property,
      metrics: {
        pricePerBedroom: property.price / property.bedrooms,
        pricePerBathroom: property.price / property.bathrooms,
        totalMonthlyExpenses:
          (property.hoaFees || 0) +
          (property.propertyTax / 12) +
          (property.price * 0.003 / 12), // Estimated insurance
      },
    }));

    return NextResponse.json({
      properties: enhancedData,
      summary: {
        priceDifference: Math.abs(
          enhancedData[0].price - enhancedData[1].price
        ),
        sizeDifference: Math.abs(
          enhancedData[0].squareFeet - enhancedData[1].squareFeet
        ),
        pricePerSqFtDifference: Math.abs(
          enhancedData[0].pricePerSqFt - enhancedData[1].pricePerSqFt
        ),
        monthlyExpensesDifference: Math.abs(
          enhancedData[0].metrics.totalMonthlyExpenses -
          enhancedData[1].metrics.totalMonthlyExpenses
        ),
      },
    });
  } catch (error) {
    console.error('Error comparing properties:', error);
    return NextResponse.json(
      { error: 'Failed to compare properties' },
      { status: 500 }
    );
  }
}