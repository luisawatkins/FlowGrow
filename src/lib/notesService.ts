import { PropertyNote, PropertyComment, NoteFilter, CommentFilter, NotesAnalytics, CommentsAnalytics } from '../types/notes';

class NotesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  // Notes Management
  async getNotes(filter?: NoteFilter): Promise<PropertyNote[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.propertyId) params.append('propertyId', filter.propertyId);
      if (filter?.userId) params.append('userId', filter.userId);
      if (filter?.type) params.append('type', filter.type);
      if (filter?.priority) params.append('priority', filter.priority);

      const response = await fetch(`${this.baseUrl}/notes?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch notes: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  async createNote(note: Omit<PropertyNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyNote> {
    try {
      const response = await fetch(`${this.baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (!response.ok) throw new Error(`Failed to create note: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async updateNote(id: string, updates: Partial<PropertyNote>): Promise<PropertyNote> {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`Failed to update note: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete note: ${response.statusText}`);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  // Comments Management
  async getComments(filter?: CommentFilter): Promise<PropertyComment[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.propertyId) params.append('propertyId', filter.propertyId);
      if (filter?.userId) params.append('userId', filter.userId);
      if (filter?.parentId) params.append('parentId', filter.parentId);

      const response = await fetch(`${this.baseUrl}/comments?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch comments: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  async createComment(comment: Omit<PropertyComment, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'dislikes' | 'isEdited'>): Promise<PropertyComment> {
    try {
      const response = await fetch(`${this.baseUrl}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      if (!response.ok) throw new Error(`Failed to create comment: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async updateComment(id: string, updates: Partial<PropertyComment>): Promise<PropertyComment> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(`Failed to update comment: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete comment: ${response.statusText}`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  // Analytics
  async getNotesAnalytics(userId: string): Promise<NotesAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/notes/analytics?userId=${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch notes analytics: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching notes analytics:', error);
      throw error;
    }
  }

  async getCommentsAnalytics(): Promise<CommentsAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/analytics`);
      if (!response.ok) throw new Error(`Failed to fetch comments analytics: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments analytics:', error);
      throw error;
    }
  }
}

export const notesService = new NotesService();