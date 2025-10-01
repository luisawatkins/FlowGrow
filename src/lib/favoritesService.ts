import { 
  FavoriteProperty, 
  FavoriteList, 
  CreateFavoriteRequest, 
  UpdateFavoriteRequest,
  CreateFavoriteListRequest,
  UpdateFavoriteListRequest,
  FavoriteStats,
  FavoriteFilter,
  FavoriteSearchResult
} from '../types/favorites';

// Mock data for development
const mockFavorites: FavoriteProperty[] = [
  {
    id: 'fav-1',
    userId: 'user-1',
    propertyId: 'prop-1',
    property: {
      id: 'prop-1',
      title: 'Modern Downtown Apartment',
      address: '123 Main St, Downtown',
      price: 450000,
      imageUrl: '/images/prop-1.jpg',
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      propertyType: 'Apartment'
    },
    addedAt: new Date('2024-01-15'),
    notes: 'Great location for investment',
    tags: ['investment', 'downtown'],
    isPublic: true
  },
  {
    id: 'fav-2',
    userId: 'user-1',
    propertyId: 'prop-2',
    property: {
      id: 'prop-2',
      title: 'Family House with Garden',
      address: '456 Oak Ave, Suburbs',
      price: 650000,
      imageUrl: '/images/prop-2.jpg',
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2500,
      propertyType: 'House'
    },
    addedAt: new Date('2024-01-16'),
    notes: 'Perfect for family',
    tags: ['family', 'garden'],
    isPublic: false
  }
];

const mockFavoriteLists: FavoriteList[] = [
  {
    id: 'list-1',
    userId: 'user-1',
    name: 'Investment Properties',
    description: 'Properties with good investment potential',
    isPublic: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-16'),
    propertyCount: 1,
    properties: [mockFavorites[0]]
  },
  {
    id: 'list-2',
    userId: 'user-1',
    name: 'Family Homes',
    description: 'Properties suitable for families',
    isPublic: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
    propertyCount: 1,
    properties: [mockFavorites[1]]
  }
];

export class FavoritesService {
  // Get all favorites for a user
  static async getUserFavorites(userId: string): Promise<FavoriteProperty[]> {
    return mockFavorites.filter(fav => fav.userId === userId);
  }

  // Get favorites by list
  static async getFavoritesByList(listId: string): Promise<FavoriteProperty[]> {
    return mockFavorites.filter(fav => {
      const list = mockFavoriteLists.find(l => l.id === listId);
      return list && list.properties.some(p => p.id === fav.id);
    });
  }

  // Add property to favorites
  static async addToFavorites(request: CreateFavoriteRequest): Promise<FavoriteProperty> {
    const property = {
      id: request.propertyId,
      title: 'Sample Property',
      address: 'Sample Address',
      price: 0,
      propertyType: 'Property'
    };

    const newFavorite: FavoriteProperty = {
      id: `fav-${Date.now()}`,
      userId: 'current-user', // In real app, get from auth context
      propertyId: request.propertyId,
      property,
      addedAt: new Date(),
      notes: request.notes,
      tags: request.tags,
      isPublic: request.isPublic
    };

    mockFavorites.push(newFavorite);

    // Add to list if specified
    if (request.listId) {
      const list = mockFavoriteLists.find(l => l.id === request.listId);
      if (list) {
        list.properties.push(newFavorite);
        list.propertyCount = list.properties.length;
        list.updatedAt = new Date();
      }
    }

    return newFavorite;
  }

  // Update favorite
  static async updateFavorite(request: UpdateFavoriteRequest): Promise<FavoriteProperty> {
    const favoriteIndex = mockFavorites.findIndex(fav => fav.id === request.id);
    if (favoriteIndex === -1) {
      throw new Error('Favorite not found');
    }

    const existingFavorite = mockFavorites[favoriteIndex];
    const updatedFavorite: FavoriteProperty = {
      ...existingFavorite,
      ...(request.notes !== undefined && { notes: request.notes }),
      ...(request.tags && { tags: request.tags }),
      ...(request.isPublic !== undefined && { isPublic: request.isPublic })
    };

    mockFavorites[favoriteIndex] = updatedFavorite;
    return updatedFavorite;
  }

  // Remove from favorites
  static async removeFromFavorites(favoriteId: string): Promise<boolean> {
    const favoriteIndex = mockFavorites.findIndex(fav => fav.id === favoriteId);
    if (favoriteIndex === -1) {
      return false;
    }

    mockFavorites.splice(favoriteIndex, 1);

    // Remove from all lists
    mockFavoriteLists.forEach(list => {
      list.properties = list.properties.filter(p => p.id !== favoriteId);
      list.propertyCount = list.properties.length;
      list.updatedAt = new Date();
    });

    return true;
  }

  // Get favorite lists
  static async getFavoriteLists(userId: string): Promise<FavoriteList[]> {
    return mockFavoriteLists.filter(list => list.userId === userId);
  }

  // Create favorite list
  static async createFavoriteList(request: CreateFavoriteListRequest): Promise<FavoriteList> {
    const newList: FavoriteList = {
      id: `list-${Date.now()}`,
      userId: 'current-user', // In real app, get from auth context
      name: request.name,
      description: request.description,
      isPublic: request.isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
      propertyCount: 0,
      properties: []
    };

    mockFavoriteLists.push(newList);
    return newList;
  }

  // Update favorite list
  static async updateFavoriteList(request: UpdateFavoriteListRequest): Promise<FavoriteList> {
    const listIndex = mockFavoriteLists.findIndex(list => list.id === request.id);
    if (listIndex === -1) {
      throw new Error('Favorite list not found');
    }

    const existingList = mockFavoriteLists[listIndex];
    const updatedList: FavoriteList = {
      ...existingList,
      ...(request.name && { name: request.name }),
      ...(request.description !== undefined && { description: request.description }),
      ...(request.isPublic !== undefined && { isPublic: request.isPublic }),
      updatedAt: new Date()
    };

    mockFavoriteLists[listIndex] = updatedList;
    return updatedList;
  }

  // Delete favorite list
  static async deleteFavoriteList(listId: string): Promise<boolean> {
    const listIndex = mockFavoriteLists.findIndex(list => list.id === listId);
    if (listIndex === -1) {
      return false;
    }

    mockFavoriteLists.splice(listIndex, 1);
    return true;
  }

  // Search favorites
  static async searchFavorites(filter: FavoriteFilter, page: number = 1, limit: number = 10): Promise<FavoriteSearchResult> {
    let filteredFavorites = [...mockFavorites];

    if (filter.listId) {
      const list = mockFavoriteLists.find(l => l.id === filter.listId);
      if (list) {
        filteredFavorites = filteredFavorites.filter(fav => 
          list.properties.some(p => p.id === fav.id)
        );
      }
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredFavorites = filteredFavorites.filter(fav => 
        filter.tags!.some(tag => fav.tags.includes(tag))
      );
    }

    if (filter.isPublic !== undefined) {
      filteredFavorites = filteredFavorites.filter(fav => fav.isPublic === filter.isPublic);
    }

    if (filter.dateFrom) {
      filteredFavorites = filteredFavorites.filter(fav => fav.addedAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      filteredFavorites = filteredFavorites.filter(fav => fav.addedAt <= filter.dateTo!);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredFavorites = filteredFavorites.filter(fav => 
        fav.property.title.toLowerCase().includes(searchTerm) ||
        fav.property.address.toLowerCase().includes(searchTerm) ||
        (fav.notes && fav.notes.toLowerCase().includes(searchTerm)) ||
        fav.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFavorites = filteredFavorites.slice(startIndex, endIndex);

    return {
      favorites: paginatedFavorites,
      total: filteredFavorites.length,
      page,
      limit,
      hasMore: endIndex < filteredFavorites.length
    };
  }

  // Get favorite statistics
  static async getFavoriteStats(userId?: string): Promise<FavoriteStats> {
    const favorites = userId 
      ? mockFavorites.filter(fav => fav.userId === userId)
      : mockFavorites;

    const favoritesByList: { [listId: string]: number } = {};
    const propertyCounts: { [propertyId: string]: number } = {};

    favorites.forEach(fav => {
      const list = mockFavoriteLists.find(l => l.properties.some(p => p.id === fav.id));
      if (list) {
        favoritesByList[list.id] = (favoritesByList[list.id] || 0) + 1;
      }
      propertyCounts[fav.propertyId] = (propertyCounts[fav.propertyId] || 0) + 1;
    });

    const mostFavoritedProperties = Object.entries(propertyCounts)
      .map(([propertyId, count]) => ({ propertyId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentFavorites = favorites
      .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
      .slice(0, 5);

    return {
      totalFavorites: favorites.length,
      favoritesByList,
      mostFavoritedProperties,
      recentFavorites
    };
  }
}