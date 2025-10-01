import { PropertyNote, NoteCategory, NotePriority, NoteFilter, NoteStats, CreateNoteRequest, UpdateNoteRequest, NoteSearchResult } from '../types/notes';

// Mock data for development
const mockNotes: PropertyNote[] = [
  {
    id: '1',
    propertyId: 'prop-1',
    userId: 'user-1',
    title: 'Great location near downtown',
    content: 'This property has excellent access to public transportation and is within walking distance of several restaurants.',
    category: { id: 'cat-1', name: 'Location', color: '#3B82F6' },
    priority: { id: 'pri-1', name: 'High', level: 3, color: '#EF4444' },
    tags: ['location', 'transportation', 'downtown'],
    isPrivate: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    propertyId: 'prop-1',
    userId: 'user-1',
    title: 'Maintenance concerns',
    content: 'The HVAC system needs updating and there are some minor plumbing issues.',
    category: { id: 'cat-2', name: 'Maintenance', color: '#F59E0B' },
    priority: { id: 'pri-2', name: 'Medium', level: 2, color: '#F59E0B' },
    tags: ['maintenance', 'hvac', 'plumbing'],
    isPrivate: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  }
];

const mockCategories: NoteCategory[] = [
  { id: 'cat-1', name: 'Location', color: '#3B82F6', description: 'Location-related notes' },
  { id: 'cat-2', name: 'Maintenance', color: '#F59E0B', description: 'Maintenance and repairs' },
  { id: 'cat-3', name: 'Financial', color: '#10B981', description: 'Financial considerations' },
  { id: 'cat-4', name: 'Legal', color: '#8B5CF6', description: 'Legal and compliance' },
  { id: 'cat-5', name: 'General', color: '#6B7280', description: 'General notes' }
];

const mockPriorities: NotePriority[] = [
  { id: 'pri-1', name: 'High', level: 3, color: '#EF4444' },
  { id: 'pri-2', name: 'Medium', level: 2, color: '#F59E0B' },
  { id: 'pri-3', name: 'Low', level: 1, color: '#10B981' }
];

export class NotesService {
  // Get all notes for a property
  static async getPropertyNotes(propertyId: string): Promise<PropertyNote[]> {
    return mockNotes.filter(note => note.propertyId === propertyId);
  }

  // Get a specific note by ID
  static async getNoteById(noteId: string): Promise<PropertyNote | null> {
    return mockNotes.find(note => note.id === noteId) || null;
  }

  // Create a new note
  static async createNote(request: CreateNoteRequest): Promise<PropertyNote> {
    const category = mockCategories.find(cat => cat.id === request.categoryId);
    const priority = mockPriorities.find(pri => pri.id === request.priorityId);
    
    if (!category || !priority) {
      throw new Error('Invalid category or priority ID');
    }

    const newNote: PropertyNote = {
      id: `note-${Date.now()}`,
      propertyId: request.propertyId,
      userId: 'current-user', // In real app, get from auth context
      title: request.title,
      content: request.content,
      category,
      priority,
      tags: request.tags,
      isPrivate: request.isPrivate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockNotes.push(newNote);
    return newNote;
  }

  // Update an existing note
  static async updateNote(request: UpdateNoteRequest): Promise<PropertyNote> {
    const noteIndex = mockNotes.findIndex(note => note.id === request.id);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const existingNote = mockNotes[noteIndex];
    const updatedNote: PropertyNote = {
      ...existingNote,
      ...(request.title && { title: request.title }),
      ...(request.content && { content: request.content }),
      ...(request.categoryId && { 
        category: mockCategories.find(cat => cat.id === request.categoryId) || existingNote.category 
      }),
      ...(request.priorityId && { 
        priority: mockPriorities.find(pri => pri.id === request.priorityId) || existingNote.priority 
      }),
      ...(request.tags && { tags: request.tags }),
      ...(request.isPrivate !== undefined && { isPrivate: request.isPrivate }),
      updatedAt: new Date(),
    };

    mockNotes[noteIndex] = updatedNote;
    return updatedNote;
  }

  // Delete a note
  static async deleteNote(noteId: string): Promise<boolean> {
    const noteIndex = mockNotes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) {
      return false;
    }

    mockNotes.splice(noteIndex, 1);
    return true;
  }

  // Search notes with filters
  static async searchNotes(filter: NoteFilter, page: number = 1, limit: number = 10): Promise<NoteSearchResult> {
    let filteredNotes = [...mockNotes];

    if (filter.propertyId) {
      filteredNotes = filteredNotes.filter(note => note.propertyId === filter.propertyId);
    }

    if (filter.categoryId) {
      filteredNotes = filteredNotes.filter(note => note.category.id === filter.categoryId);
    }

    if (filter.priorityId) {
      filteredNotes = filteredNotes.filter(note => note.priority.id === filter.priorityId);
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredNotes = filteredNotes.filter(note => 
        filter.tags!.some(tag => note.tags.includes(tag))
      );
    }

    if (filter.isPrivate !== undefined) {
      filteredNotes = filteredNotes.filter(note => note.isPrivate === filter.isPrivate);
    }

    if (filter.dateFrom) {
      filteredNotes = filteredNotes.filter(note => note.createdAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      filteredNotes = filteredNotes.filter(note => note.createdAt <= filter.dateTo!);
    }

    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotes = filteredNotes.slice(startIndex, endIndex);

    return {
      notes: paginatedNotes,
      total: filteredNotes.length,
      page,
      limit,
      hasMore: endIndex < filteredNotes.length
    };
  }

  // Get note categories
  static async getCategories(): Promise<NoteCategory[]> {
    return mockCategories;
  }

  // Get note priorities
  static async getPriorities(): Promise<NotePriority[]> {
    return mockPriorities;
  }

  // Get note statistics
  static async getNoteStats(propertyId?: string): Promise<NoteStats> {
    const notes = propertyId 
      ? mockNotes.filter(note => note.propertyId === propertyId)
      : mockNotes;

    const notesByCategory: { [categoryId: string]: number } = {};
    const notesByPriority: { [priorityId: string]: number } = {};
    const tagCounts: { [tag: string]: number } = {};

    notes.forEach(note => {
      notesByCategory[note.category.id] = (notesByCategory[note.category.id] || 0) + 1;
      notesByPriority[note.priority.id] = (notesByPriority[note.priority.id] || 0) + 1;
      
      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const mostUsedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentNotes = notes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      totalNotes: notes.length,
      notesByCategory,
      notesByPriority,
      recentNotes,
      mostUsedTags
    };
  }
}