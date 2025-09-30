// Property Notes and Comments Service

import { 
  PropertyNote, 
  PropertyComment, 
  CreateNoteRequest, 
  UpdateNoteRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  NotesResponse,
  CommentsResponse,
  NotesFilter,
  CommentsFilter,
  NotesAnalytics,
  CommentsAnalytics,
  NotesError,
  NoteType,
  NotePriority
} from '@/types/notes';

// Mock data for development
const mockNotes: PropertyNote[] = [
  {
    id: 'note-1',
    propertyId: 'property-1',
    userId: 'user-1',
    title: 'First viewing notes',
    content: 'Great location, but needs some renovation. The kitchen is outdated but has potential.',
    type: NoteType.VIEWING,
    tags: ['viewing', 'kitchen', 'renovation'],
    isPrivate: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    metadata: {
      wordCount: 20,
      priority: NotePriority.MEDIUM,
      isPinned: false
    }
  },
  {
    id: 'note-2',
    propertyId: 'property-1',
    userId: 'user-1',
    title: 'Financial analysis',
    content: 'Price seems reasonable for the area. Comparable properties are selling for $50k more.',
    type: NoteType.FINANCIAL,
    tags: ['price', 'comparison', 'value'],
    isPrivate: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    metadata: {
      wordCount: 18,
      priority: NotePriority.HIGH,
      isPinned: true
    }
  },
  {
    id: 'note-3',
    propertyId: 'property-2',
    userId: 'user-2',
    title: 'Market research',
    content: 'This neighborhood is trending up. New developments nearby will increase property values.',
    type: NoteType.MARKET,
    tags: ['market', 'trends', 'development'],
    isPrivate: false,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    metadata: {
      wordCount: 22,
      priority: NotePriority.MEDIUM,
      isPinned: false
    }
  }
];

const mockComments: PropertyComment[] = [
  {
    id: 'comment-1',
    propertyId: 'property-1',
    userId: 'user-2',
    content: 'I viewed this property last week. The location is amazing!',
    isApproved: true,
    isModerated: false,
    likes: 5,
    dislikes: 0,
    replies: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    metadata: {
      wordCount: 15,
      isEdited: false,
      reportedCount: 0,
      isHighlighted: false
    }
  },
  {
    id: 'comment-2',
    propertyId: 'property-1',
    userId: 'user-3',
    parentId: 'comment-1',
    content: 'I agree! The neighborhood is really nice.',
    isApproved: true,
    isModerated: false,
    likes: 2,
    dislikes: 0,
    replies: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    metadata: {
      wordCount: 8,
      isEdited: false,
      reportedCount: 0,
      isHighlighted: false
    }
  },
  {
    id: 'comment-3',
    propertyId: 'property-2',
    userId: 'user-1',
    content: 'Has anyone had issues with the HOA here?',
    isApproved: false,
    isModerated: false,
    likes: 0,
    dislikes: 0,
    replies: [],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    metadata: {
      wordCount: 10,
      isEdited: false,
      reportedCount: 0,
      isHighlighted: false
    }
  }
];

class NotesService {
  private notes: PropertyNote[] = [...mockNotes];
  private comments: PropertyComment[] = [...mockComments];

  // Notes CRUD Operations
  async createNote(request: CreateNoteRequest): Promise<PropertyNote> {
    try {
      const note: PropertyNote = {
        id: `note-${Date.now()}`,
        propertyId: request.propertyId,
        userId: 'current-user', // In real app, get from auth context
        title: request.title,
        content: request.content,
        type: request.type,
        tags: request.tags || [],
        isPrivate: request.isPrivate ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          wordCount: request.content.split(' ').length,
          priority: request.priority || NotePriority.MEDIUM,
          isPinned: false,
          attachments: request.attachments || []
        }
      };

      this.notes.push(note);
      return note;
    } catch (error) {
      throw this.handleError('CREATE_NOTE_FAILED', 'Failed to create note', error);
    }
  }

  async getNote(id: string): Promise<PropertyNote> {
    try {
      const note = this.notes.find(n => n.id === id);
      if (!note) {
        throw this.handleError('NOTE_NOT_FOUND', 'Note not found');
      }
      return note;
    } catch (error) {
      throw this.handleError('GET_NOTE_FAILED', 'Failed to get note', error);
    }
  }

  async updateNote(id: string, request: UpdateNoteRequest): Promise<PropertyNote> {
    try {
      const noteIndex = this.notes.findIndex(n => n.id === id);
      if (noteIndex === -1) {
        throw this.handleError('NOTE_NOT_FOUND', 'Note not found');
      }

      const existingNote = this.notes[noteIndex];
      const updatedNote: PropertyNote = {
        ...existingNote,
        ...request,
        updatedAt: new Date(),
        metadata: {
          ...existingNote.metadata,
          wordCount: request.content ? request.content.split(' ').length : existingNote.metadata?.wordCount,
          priority: request.priority || existingNote.metadata?.priority,
          attachments: request.attachments || existingNote.metadata?.attachments
        }
      };

      this.notes[noteIndex] = updatedNote;
      return updatedNote;
    } catch (error) {
      throw this.handleError('UPDATE_NOTE_FAILED', 'Failed to update note', error);
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      const noteIndex = this.notes.findIndex(n => n.id === id);
      if (noteIndex === -1) {
        throw this.handleError('NOTE_NOT_FOUND', 'Note not found');
      }

      this.notes.splice(noteIndex, 1);
    } catch (error) {
      throw this.handleError('DELETE_NOTE_FAILED', 'Failed to delete note', error);
    }
  }

  async getNotesByProperty(propertyId: string, filter?: NotesFilter): Promise<PropertyNote[]> {
    try {
      let filteredNotes = this.notes.filter(note => note.propertyId === propertyId);

      if (filter) {
        filteredNotes = this.applyNotesFilter(filteredNotes, filter);
      }

      return filteredNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      throw this.handleError('GET_NOTES_FAILED', 'Failed to get notes', error);
    }
  }

  async searchNotes(query: string, filter?: NotesFilter): Promise<PropertyNote[]> {
    try {
      let filteredNotes = this.notes;

      if (filter) {
        filteredNotes = this.applyNotesFilter(filteredNotes, filter);
      }

      const searchQuery = query.toLowerCase();
      return filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery) ||
        note.content.toLowerCase().includes(searchQuery) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    } catch (error) {
      throw this.handleError('SEARCH_NOTES_FAILED', 'Failed to search notes', error);
    }
  }

  // Comments CRUD Operations
  async createComment(request: CreateCommentRequest): Promise<PropertyComment> {
    try {
      const comment: PropertyComment = {
        id: `comment-${Date.now()}`,
        propertyId: request.propertyId,
        userId: 'current-user', // In real app, get from auth context
        parentId: request.parentId,
        content: request.content,
        isApproved: false, // Comments need approval by default
        isModerated: false,
        likes: 0,
        dislikes: 0,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          wordCount: request.content.split(' ').length,
          isEdited: false,
          reportedCount: 0,
          isHighlighted: false
        }
      };

      this.comments.push(comment);
      return comment;
    } catch (error) {
      throw this.handleError('CREATE_COMMENT_FAILED', 'Failed to create comment', error);
    }
  }

  async getComment(id: string): Promise<PropertyComment> {
    try {
      const comment = this.comments.find(c => c.id === id);
      if (!comment) {
        throw this.handleError('COMMENT_NOT_FOUND', 'Comment not found');
      }
      return comment;
    } catch (error) {
      throw this.handleError('GET_COMMENT_FAILED', 'Failed to get comment', error);
    }
  }

  async updateComment(id: string, request: UpdateCommentRequest): Promise<PropertyComment> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id);
      if (commentIndex === -1) {
        throw this.handleError('COMMENT_NOT_FOUND', 'Comment not found');
      }

      const existingComment = this.comments[commentIndex];
      const updatedComment: PropertyComment = {
        ...existingComment,
        content: request.content,
        updatedAt: new Date(),
        metadata: {
          ...existingComment.metadata,
          wordCount: request.content.split(' ').length,
          isEdited: true,
          editHistory: [
            ...(existingComment.metadata?.editHistory || []),
            {
              id: `edit-${Date.now()}`,
              content: existingComment.content,
              editedAt: new Date(),
              reason: 'User edit'
            }
          ]
        }
      };

      this.comments[commentIndex] = updatedComment;
      return updatedComment;
    } catch (error) {
      throw this.handleError('UPDATE_COMMENT_FAILED', 'Failed to update comment', error);
    }
  }

  async deleteComment(id: string): Promise<void> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id);
      if (commentIndex === -1) {
        throw this.handleError('COMMENT_NOT_FOUND', 'Comment not found');
      }

      this.comments.splice(commentIndex, 1);
    } catch (error) {
      throw this.handleError('DELETE_COMMENT_FAILED', 'Failed to delete comment', error);
    }
  }

  async getCommentsByProperty(propertyId: string, filter?: CommentsFilter): Promise<PropertyComment[]> {
    try {
      let filteredComments = this.comments.filter(comment => comment.propertyId === propertyId);

      if (filter) {
        filteredComments = this.applyCommentsFilter(filteredComments, filter);
      }

      // Build comment tree structure
      return this.buildCommentTree(filteredComments);
    } catch (error) {
      throw this.handleError('GET_COMMENTS_FAILED', 'Failed to get comments', error);
    }
  }

  async approveComment(id: string): Promise<PropertyComment> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id);
      if (commentIndex === -1) {
        throw this.handleError('COMMENT_NOT_FOUND', 'Comment not found');
      }

      this.comments[commentIndex].isApproved = true;
      this.comments[commentIndex].updatedAt = new Date();
      return this.comments[commentIndex];
    } catch (error) {
      throw this.handleError('APPROVE_COMMENT_FAILED', 'Failed to approve comment', error);
    }
  }

  async moderateComment(id: string, reason: string): Promise<PropertyComment> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id);
      if (commentIndex === -1) {
        throw this.handleError('COMMENT_NOT_FOUND', 'Comment not found');
      }

      this.comments[commentIndex].isModerated = true;
      this.comments[commentIndex].moderationReason = reason;
      this.comments[commentIndex].updatedAt = new Date();
      return this.comments[commentIndex];
    } catch (error) {
      throw this.handleError('MODERATE_COMMENT_FAILED', 'Failed to moderate comment', error);
    }
  }

  async likeComment(id: string): Promise<PropertyComment> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id);
      if (commentIndex === -1) {
        throw this.handleError('COMMENT_NOT_FOUND', 'Comment not found');
      }

      this.comments[commentIndex].likes += 1;
      this.comments[commentIndex].updatedAt = new Date();
      return this.comments[commentIndex];
    } catch (error) {
      throw this.handleError('LIKE_COMMENT_FAILED', 'Failed to like comment', error);
    }
  }

  async dislikeComment(id: string): Promise<PropertyComment> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id);
      if (commentIndex === -1) {
        throw this.handleError('COMMENT_NOT_FOUND', 'Comment not found');
      }

      this.comments[commentIndex].dislikes += 1;
      this.comments[commentIndex].updatedAt = new Date();
      return this.comments[commentIndex];
    } catch (error) {
      throw this.handleError('DISLIKE_COMMENT_FAILED', 'Failed to dislike comment', error);
    }
  }

  // Analytics
  async getNotesAnalytics(propertyId?: string): Promise<NotesAnalytics> {
    try {
      let notes = this.notes;
      if (propertyId) {
        notes = notes.filter(note => note.propertyId === propertyId);
      }

      const notesByType = Object.values(NoteType).reduce((acc, type) => {
        acc[type] = notes.filter(note => note.type === type).length;
        return acc;
      }, {} as Record<NoteType, number>);

      const notesByPriority = Object.values(NotePriority).reduce((acc, priority) => {
        acc[priority] = notes.filter(note => note.metadata?.priority === priority).length;
        return acc;
      }, {} as Record<NotePriority, number>);

      const tagCounts = notes.reduce((acc, note) => {
        note.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const mostUsedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const uniqueProperties = new Set(notes.map(note => note.propertyId)).size;
      const averageNotesPerProperty = uniqueProperties > 0 ? notes.length / uniqueProperties : 0;

      return {
        totalNotes: notes.length,
        notesByType,
        notesByPriority,
        averageNotesPerProperty,
        mostUsedTags,
        recentActivity: this.generateRecentActivity(notes)
      };
    } catch (error) {
      throw this.handleError('GET_NOTES_ANALYTICS_FAILED', 'Failed to get notes analytics', error);
    }
  }

  async getCommentsAnalytics(propertyId?: string): Promise<CommentsAnalytics> {
    try {
      let comments = this.comments;
      if (propertyId) {
        comments = comments.filter(comment => comment.propertyId === propertyId);
      }

      const approvedComments = comments.filter(c => c.isApproved).length;
      const pendingComments = comments.filter(c => !c.isApproved).length;
      const moderatedComments = comments.filter(c => c.isModerated).length;

      const userCommentCounts = comments.reduce((acc, comment) => {
        acc[comment.userId] = (acc[comment.userId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCommenters = Object.entries(userCommentCounts)
        .map(([userId, commentCount]) => ({
          userId,
          username: `User ${userId}`, // In real app, get from user service
          commentCount
        }))
        .sort((a, b) => b.commentCount - a.commentCount)
        .slice(0, 10);

      const totalLikes = comments.reduce((sum, comment) => sum + comment.likes, 0);
      const totalDislikes = comments.reduce((sum, comment) => sum + comment.dislikes, 0);
      const averageLikesPerComment = comments.length > 0 ? totalLikes / comments.length : 0;

      const uniqueProperties = new Set(comments.map(comment => comment.propertyId)).size;
      const averageCommentsPerProperty = uniqueProperties > 0 ? comments.length / uniqueProperties : 0;

      return {
        totalComments: comments.length,
        approvedComments,
        pendingComments,
        moderatedComments,
        averageCommentsPerProperty,
        topCommenters,
        engagementMetrics: {
          totalLikes,
          totalDislikes,
          averageLikesPerComment
        }
      };
    } catch (error) {
      throw this.handleError('GET_COMMENTS_ANALYTICS_FAILED', 'Failed to get comments analytics', error);
    }
  }

  // Helper methods
  private applyNotesFilter(notes: PropertyNote[], filter: NotesFilter): PropertyNote[] {
    return notes.filter(note => {
      if (filter.userId && note.userId !== filter.userId) return false;
      if (filter.type && note.type !== filter.type) return false;
      if (filter.isPrivate !== undefined && note.isPrivate !== filter.isPrivate) return false;
      if (filter.priority && note.metadata?.priority !== filter.priority) return false;
      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some(tag => note.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }
      if (filter.dateFrom && note.createdAt < filter.dateFrom) return false;
      if (filter.dateTo && note.createdAt > filter.dateTo) return false;
      return true;
    });
  }

  private applyCommentsFilter(comments: PropertyComment[], filter: CommentsFilter): PropertyComment[] {
    return comments.filter(comment => {
      if (filter.userId && comment.userId !== filter.userId) return false;
      if (filter.parentId !== undefined && comment.parentId !== filter.parentId) return false;
      if (filter.isApproved !== undefined && comment.isApproved !== filter.isApproved) return false;
      if (filter.isModerated !== undefined && comment.isModerated !== filter.isModerated) return false;
      if (filter.dateFrom && comment.createdAt < filter.dateFrom) return false;
      if (filter.dateTo && comment.createdAt > filter.dateTo) return false;
      return true;
    });
  }

  private buildCommentTree(comments: PropertyComment[]): PropertyComment[] {
    const commentMap = new Map<string, PropertyComment>();
    const rootComments: PropertyComment[] = [];

    // Create a map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Build the tree structure
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  private generateRecentActivity(notes: PropertyNote[]): Array<{ date: string; notesCreated: number; commentsCreated: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const notesCreated = notes.filter(note => 
        note.createdAt.toISOString().split('T')[0] === date
      ).length;

      const commentsCreated = this.comments.filter(comment => 
        comment.createdAt.toISOString().split('T')[0] === date
      ).length;

      return { date, notesCreated, commentsCreated };
    }).reverse();
  }

  private handleError(code: string, message: string, details?: any): NotesError {
    return {
      code,
      message,
      details
    };
  }
}

export const notesService = new NotesService();
