export interface PropertyNote {
  id: string;
  propertyId: string;
  userId: string;
  title: string;
  content: string;
  category: NoteCategory;
  priority: NotePriority;
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  attachments?: NoteAttachment[];
}

export interface NoteAttachment {
  id: string;
  noteId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface NotePriority {
  id: string;
  name: string;
  level: number;
  color: string;
}

export interface NoteFilter {
  propertyId?: string;
  categoryId?: string;
  priorityId?: string;
  tags?: string[];
  isPrivate?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface NoteStats {
  totalNotes: number;
  notesByCategory: { [categoryId: string]: number };
  notesByPriority: { [priorityId: string]: number };
  recentNotes: PropertyNote[];
  mostUsedTags: { tag: string; count: number }[];
}

export interface CreateNoteRequest {
  propertyId: string;
  title: string;
  content: string;
  categoryId: string;
  priorityId: string;
  tags: string[];
  isPrivate: boolean;
  attachments?: File[];
}

export interface UpdateNoteRequest {
  id: string;
  title?: string;
  content?: string;
  categoryId?: string;
  priorityId?: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface NoteSearchResult {
  notes: PropertyNote[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}