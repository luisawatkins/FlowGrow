export interface PropertyNote {
  id: string;
  propertyId: string;
  userId: string;
  title: string;
  content: string;
  type: NoteType;
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: NoteMetadata;
}

export interface PropertyComment {
  id: string;
  propertyId: string;
  userId: string;
  parentId?: string; // For threaded comments
  content: string;
  isApproved: boolean;
  isModerated: boolean;
  moderationReason?: string;
  likes: number;
  dislikes: number;
  replies: PropertyComment[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: CommentMetadata;
}

export interface NoteMetadata {
  wordCount: number;
  lastReadAt?: Date;
  isPinned: boolean;
  priority: NotePriority;
  attachments?: string[];
}

export interface CommentMetadata {
  wordCount: number;
  isEdited: boolean;
  editHistory?: CommentEdit[];
  reportedCount: number;
  isHighlighted: boolean;
}

export interface CommentEdit {
  id: string;
  content: string;
  editedAt: Date;
  reason?: string;
}

export enum NoteType {
  PERSONAL = 'personal',
  VIEWING = 'viewing',
  FINANCIAL = 'financial',
  MAINTENANCE = 'maintenance',
  MARKET = 'market',
  GENERAL = 'general'
}

export enum NotePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface CreateNoteRequest {
  propertyId: string;
  title: string;
  content: string;
  type: NoteType;
  tags?: string[];
  isPrivate?: boolean;
  priority?: NotePriority;
  attachments?: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  type?: NoteType;
  tags?: string[];
  isPrivate?: boolean;
  priority?: NotePriority;
  attachments?: string[];
}

export interface CreateCommentRequest {
  propertyId: string;
  parentId?: string;
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface NotesResponse {
  notes: PropertyNote[];
  total: number;
  page: number;
  limit: number;
}

export interface CommentsResponse {
  comments: PropertyComment[];
  total: number;
  page: number;
  limit: number;
}

export interface NotesFilter {
  propertyId?: string;
  userId?: string;
  type?: NoteType;
  tags?: string[];
  isPrivate?: boolean;
  priority?: NotePriority;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CommentsFilter {
  propertyId?: string;
  userId?: string;
  parentId?: string;
  isApproved?: boolean;
  isModerated?: boolean;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NotesAnalytics {
  totalNotes: number;
  notesByType: Record<NoteType, number>;
  notesByPriority: Record<NotePriority, number>;
  averageNotesPerProperty: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  recentActivity: Array<{
    date: string;
    notesCreated: number;
    commentsCreated: number;
  }>;
}

export interface CommentsAnalytics {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  moderatedComments: number;
  averageCommentsPerProperty: number;
  topCommenters: Array<{
    userId: string;
    username: string;
    commentCount: number;
  }>;
  engagementMetrics: {
    totalLikes: number;
    totalDislikes: number;
    averageLikesPerComment: number;
  };
}

export interface NotesError {
  code: string;
  message: string;
  details?: any;
}

export interface UseNotesReturn {
  notes: PropertyNote[];
  loading: boolean;
  error: NotesError | null;
  createNote: (request: CreateNoteRequest) => Promise<PropertyNote>;
  updateNote: (id: string, request: UpdateNoteRequest) => Promise<PropertyNote>;
  deleteNote: (id: string) => Promise<void>;
  getNote: (id: string) => Promise<PropertyNote>;
  getNotesByProperty: (propertyId: string, filter?: NotesFilter) => Promise<PropertyNote[]>;
  searchNotes: (query: string, filter?: NotesFilter) => Promise<PropertyNote[]>;
  refreshNotes: () => Promise<void>;
}

export interface UseCommentsReturn {
  comments: PropertyComment[];
  loading: boolean;
  error: NotesError | null;
  createComment: (request: CreateCommentRequest) => Promise<PropertyComment>;
  updateComment: (id: string, request: UpdateCommentRequest) => Promise<PropertyComment>;
  deleteComment: (id: string) => Promise<void>;
  getComment: (id: string) => Promise<PropertyComment>;
  getCommentsByProperty: (propertyId: string, filter?: CommentsFilter) => Promise<PropertyComment[]>;
  approveComment: (id: string) => Promise<PropertyComment>;
  moderateComment: (id: string, reason: string) => Promise<PropertyComment>;
  likeComment: (id: string) => Promise<PropertyComment>;
  dislikeComment: (id: string) => Promise<PropertyComment>;
  refreshComments: () => Promise<void>;
}

export interface UseNotesAnalyticsReturn {
  analytics: NotesAnalytics | null;
  loading: boolean;
  error: NotesError | null;
  refreshAnalytics: () => Promise<void>;
}

export interface UseCommentsAnalyticsReturn {
  analytics: CommentsAnalytics | null;
  loading: boolean;
  error: NotesError | null;
  refreshAnalytics: () => Promise<void>;
}
