export interface PropertyNote {
  id: string;
  propertyId: string;
  userId: string;
  title: string;
  content: string;
  type: 'general' | 'viewing' | 'research' | 'comparison' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

export interface PropertyComment {
  id: string;
  propertyId: string;
  userId: string;
  content: string;
  parentId?: string;
  likes: number;
  dislikes: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: PropertyComment[];
}

export interface NoteFilter {
  propertyId?: string;
  userId?: string;
  type?: string;
  priority?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface CommentFilter {
  propertyId?: string;
  userId?: string;
  parentId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotesAnalytics {
  totalNotes: number;
  notesByType: Record<string, number>;
  notesByPriority: Record<string, number>;
  mostUsedTags: Array<{ tag: string; count: number }>;
  recentActivity: Array<{ date: string; count: number }>;
}

export interface CommentsAnalytics {
  totalComments: number;
  commentsByProperty: Array<{ propertyId: string; count: number }>;
  topCommenters: Array<{ userId: string; count: number }>;
  engagementRate: number;
  averageLikes: number;
}