import { PropertyFavorite, Wishlist, FavoriteFilter, WishlistFilter } from '../types/favorites';

class FavoritesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  async getFavorites(filter?: FavoriteFilter): Promise<PropertyFavorite[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.userId) params.append('userId', filter.userId);
      if (filter?.propertyId) params.append('propertyId', filter.propertyId);

      const response = await fetch(`${this.baseUrl}/favorites?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch favorites: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  async addFavorite(favorite: Omit<PropertyFavorite, 'id' | 'addedAt'>): Promise<PropertyFavorite> {
    try {
      const response = await fetch(`${this.baseUrl}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorite),
      });
      if (!response.ok) throw new Error(`Failed to add favorite: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/favorites/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to remove favorite: ${response.statusText}`);
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getWishlists(filter?: WishlistFilter): Promise<Wishlist[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.userId) params.append('userId', filter.userId);
      if (filter?.isPublic !== undefined) params.append('isPublic', filter.isPublic.toString());

      const response = await fetch(`${this.baseUrl}/wishlist?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch wishlists: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      return [];
    }
  }

  async createWishlist(wishlist: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wishlist> {
    try {
      const response = await fetch(`${this.baseUrl}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wishlist),
      });
      if (!response.ok) throw new Error(`Failed to create wishlist: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating wishlist:', error);
      throw error;
    }
  }
}

export const favoritesService = new FavoritesService();