import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { PropertyFilters } from '@/components/Search/FilterPanel';

export async function POST(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get('q') || '';
    const filters: PropertyFilters = await request.json();

    // Mock database with more diverse properties
    const mockDatabase = [
      {
        id: '1',
        title: 'Modern Downtown Apartment',
        price: 450000,
        imageUrl: '/images/properties/apartment1.jpg',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        propertyType: 'Apartment',
        location: 'Downtown',
        amenities: ['Parking', 'Gym', 'Pool'],
        yearBuilt: 2020,
      },
      {
        id: '2',
        title: 'Suburban Family Home',
        price: 750000,
        imageUrl: '/images/properties/house1.jpg',
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2500,
        propertyType: 'House',
        location: 'Suburbs',
        amenities: ['Garage', 'Garden', 'Fireplace'],
        yearBuilt: 2015,
      },
      {
        id: '3',
        title: 'Luxury Beachfront Villa',
        price: 1200000,
        imageUrl: '/images/properties/villa1.jpg',
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 3500,
        propertyType: 'Villa',
        location: 'Beachfront',
        amenities: ['Pool', 'Beach Access', 'Security'],
        yearBuilt: 2018,
      },
      {
        id: '4',
        title: 'Cozy Studio Apartment',
        price: 250000,
        imageUrl: '/images/properties/studio1.jpg',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 600,
        propertyType: 'Studio',
        location: 'City Center',
        amenities: ['Furnished', 'Security'],
        yearBuilt: 2019,
      },
      {
        id: '5',
        title: 'Mountain View Cottage',
        price: 550000,
        imageUrl: '/images/properties/cottage1.jpg',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        propertyType: 'House',
        location: 'Mountain Area',
        amenities: ['Fireplace', 'View', 'Garden'],
        yearBuilt: 2017,
      },
    ];

    // Apply filters
    let filteredResults = mockDatabase.filter(property => {
      // Text search in title and location
      if (searchQuery && !property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        if (filters.priceRange.min && property.price < filters.priceRange.min) return false;
        if (filters.priceRange.max && property.price > filters.priceRange.max) return false;
      }

      // Bedrooms filter
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;

      // Bathrooms filter
      if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false;

      // Property type filter
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;

      // Location filter
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;

      // Square footage filter
      if (filters.squareFeet) {
        if (filters.squareFeet.min && property.squareFeet < filters.squareFeet.min) return false;
        if (filters.squareFeet.max && property.squareFeet > filters.squareFeet.max) return false;
      }

      return true;
    });

    // Sort results
    if (filters.sortBy) {
      filteredResults.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'newest':
            return b.yearBuilt - a.yearBuilt;
          case 'size-desc':
            return b.squareFeet - a.squareFeet;
          default:
            return 0;
        }
      });
    }

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      results: filteredResults,
      total: filteredResults.length,
      filters: filters
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
