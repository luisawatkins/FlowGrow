// Notes Service Test Suite

import { notesService } from '@/lib/notesService';
import { 
  CreateNoteRequest, 
  UpdateNoteRequest, 
  CreateCommentRequest, 
  UpdateCommentRequest,
  NoteType,
  NotePriority
} from '@/types/notes';

describe('NotesService', () => {
  beforeEach(() => {
    // Reset service state before each test
    jest.clearAllMocks();
  });

  describe('Notes CRUD Operations', () => {
    it('should create a new note', async () => {
      const noteData: CreateNoteRequest = {
        propertyId: 'property-1',
        title: 'Test Note',
        content: 'This is a test note content',
        type: NoteType.GENERAL,
        tags: ['test', 'sample'],
        isPrivate: true,
        priority: NotePriority.MEDIUM
      };

      const note = await notesService.createNote(noteData);

      expect(note).toBeDefined();
      expect(note.title).toBe(noteData.title);
      expect(note.content).toBe(noteData.content);
      expect(note.type).toBe(noteData.type);
      expect(note.tags).toEqual(noteData.tags);
      expect(note.isPrivate).toBe(noteData.isPrivate);
      expect(note.metadata?.priority).toBe(noteData.priority);
      expect(note.metadata?.wordCount).toBe(6); // "This is a test note content"
    });

    it('should get a note by ID', async () => {
      const noteData: CreateNoteRequest = {
        propertyId: 'property-1',
        title: 'Test Note',
        content: 'This is a test note',
        type: NoteType.GENERAL
      };

      const createdNote = await notesService.createNote(noteData);
      const retrievedNote = await notesService.getNote(createdNote.id);

      expect(retrievedNote).toEqual(createdNote);
    });

    it('should update a note', async () => {
      const noteData: CreateNoteRequest = {
        propertyId: 'property-1',
        title: 'Original Title',
        content: 'Original content',
        type: NoteType.GENERAL
      };

      const createdNote = await notesService.createNote(noteData);
      
      const updateData: UpdateNoteRequest = {
        title: 'Updated Title',
        content: 'Updated content with more words',
        type: NoteType.FINANCIAL,
        priority: NotePriority.HIGH
      };

      const updatedNote = await notesService.updateNote(createdNote.id, updateData);

      expect(updatedNote.title).toBe(updateData.title);
      expect(updatedNote.content).toBe(updateData.content);
      expect(updatedNote.type).toBe(updateData.type);
      expect(updatedNote.metadata?.priority).toBe(updateData.priority);
      expect(updatedNote.metadata?.wordCount).toBe(5); // "Updated content with more words"
      expect(updatedNote.updatedAt.getTime()).toBeGreaterThan(createdNote.updatedAt.getTime());
    });

    it('should delete a note', async () => {
      const noteData: CreateNoteRequest = {
        propertyId: 'property-1',
        title: 'To Delete',
        content: 'This note will be deleted',
        type: NoteType.GENERAL
      };

      const createdNote = await notesService.createNote(noteData);
      await notesService.deleteNote(createdNote.id);

      await expect(notesService.getNote(createdNote.id)).rejects.toThrow('Note not found');
    });

    it('should get notes by property ID', async () => {
      const propertyId = 'property-1';
      
      const note1: CreateNoteRequest = {
        propertyId,
        title: 'Note 1',
        content: 'First note',
        type: NoteType.GENERAL
      };

      const note2: CreateNoteRequest = {
        propertyId,
        title: 'Note 2',
        content: 'Second note',
        type: NoteType.FINANCIAL
      };

      await notesService.createNote(note1);
      await notesService.createNote(note2);

      const notes = await notesService.getNotesByProperty(propertyId);

      expect(notes).toHaveLength(2);
      expect(notes[0].propertyId).toBe(propertyId);
      expect(notes[1].propertyId).toBe(propertyId);
    });

    it('should search notes by query', async () => {
      const note1: CreateNoteRequest = {
        propertyId: 'property-1',
        title: 'Kitchen Renovation',
        content: 'Need to update the kitchen cabinets',
        type: NoteType.MAINTENANCE,
        tags: ['kitchen', 'renovation']
      };

      const note2: CreateNoteRequest = {
        propertyId: 'property-1',
        title: 'Financial Analysis',
        content: 'Property value is increasing',
        type: NoteType.FINANCIAL,
        tags: ['value', 'market']
      };

      await notesService.createNote(note1);
      await notesService.createNote(note2);

      const searchResults = await notesService.searchNotes('kitchen');

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].title).toBe('Kitchen Renovation');
    });
  });

  describe('Comments CRUD Operations', () => {
    it('should create a new comment', async () => {
      const commentData: CreateCommentRequest = {
        propertyId: 'property-1',
        content: 'This is a test comment'
      };

      const comment = await notesService.createComment(commentData);

      expect(comment).toBeDefined();
      expect(comment.content).toBe(commentData.content);
      expect(comment.propertyId).toBe(commentData.propertyId);
      expect(comment.isApproved).toBe(false); // Comments need approval by default
      expect(comment.likes).toBe(0);
      expect(comment.dislikes).toBe(0);
      expect(comment.metadata?.wordCount).toBe(5); // "This is a test comment"
    });

    it('should create a reply comment', async () => {
      const parentCommentData: CreateCommentRequest = {
        propertyId: 'property-1',
        content: 'Original comment'
      };

      const parentComment = await notesService.createComment(parentCommentData);

      const replyData: CreateCommentRequest = {
        propertyId: 'property-1',
        parentId: parentComment.id,
        content: 'This is a reply'
      };

      const reply = await notesService.createComment(replyData);

      expect(reply.parentId).toBe(parentComment.id);
      expect(reply.content).toBe(replyData.content);
    });

    it('should get comments by property ID', async () => {
      const propertyId = 'property-1';
      
      const comment1: CreateCommentRequest = {
        propertyId,
        content: 'First comment'
      };

      const comment2: CreateCommentRequest = {
        propertyId,
        content: 'Second comment'
      };

      await notesService.createComment(comment1);
      await notesService.createComment(comment2);

      const comments = await notesService.getCommentsByProperty(propertyId);

      expect(comments).toHaveLength(2);
      expect(comments[0].propertyId).toBe(propertyId);
      expect(comments[1].propertyId).toBe(propertyId);
    });

    it('should approve a comment', async () => {
      const commentData: CreateCommentRequest = {
        propertyId: 'property-1',
        content: 'Comment to approve'
      };

      const comment = await notesService.createComment(commentData);
      expect(comment.isApproved).toBe(false);

      const approvedComment = await notesService.approveComment(comment.id);

      expect(approvedComment.isApproved).toBe(true);
      expect(approvedComment.updatedAt.getTime()).toBeGreaterThan(comment.updatedAt.getTime());
    });

    it('should moderate a comment', async () => {
      const commentData: CreateCommentRequest = {
        propertyId: 'property-1',
        content: 'Comment to moderate'
      };

      const comment = await notesService.createComment(commentData);
      const reason = 'Inappropriate content';

      const moderatedComment = await notesService.moderateComment(comment.id, reason);

      expect(moderatedComment.isModerated).toBe(true);
      expect(moderatedComment.moderationReason).toBe(reason);
    });

    it('should like a comment', async () => {
      const commentData: CreateCommentRequest = {
        propertyId: 'property-1',
        content: 'Comment to like'
      };

      const comment = await notesService.createComment(commentData);
      expect(comment.likes).toBe(0);

      const likedComment = await notesService.likeComment(comment.id);

      expect(likedComment.likes).toBe(1);
    });

    it('should dislike a comment', async () => {
      const commentData: CreateCommentRequest = {
        propertyId: 'property-1',
        content: 'Comment to dislike'
      };

      const comment = await notesService.createComment(commentData);
      expect(comment.dislikes).toBe(0);

      const dislikedComment = await notesService.dislikeComment(comment.id);

      expect(dislikedComment.dislikes).toBe(1);
    });
  });

  describe('Analytics', () => {
    it('should generate notes analytics', async () => {
      const propertyId = 'property-1';
      
      // Create notes of different types
      await notesService.createNote({
        propertyId,
        title: 'General Note',
        content: 'General content',
        type: NoteType.GENERAL,
        tags: ['general']
      });

      await notesService.createNote({
        propertyId,
        title: 'Financial Note',
        content: 'Financial content',
        type: NoteType.FINANCIAL,
        tags: ['financial', 'money']
      });

      await notesService.createNote({
        propertyId,
        title: 'Another General Note',
        content: 'More general content',
        type: NoteType.GENERAL,
        tags: ['general', 'info']
      });

      const analytics = await notesService.getNotesAnalytics(propertyId);

      expect(analytics.totalNotes).toBe(3);
      expect(analytics.notesByType[NoteType.GENERAL]).toBe(2);
      expect(analytics.notesByType[NoteType.FINANCIAL]).toBe(1);
      expect(analytics.mostUsedTags).toContainEqual({ tag: 'general', count: 2 });
      expect(analytics.mostUsedTags).toContainEqual({ tag: 'financial', count: 1 });
      expect(analytics.averageNotesPerProperty).toBe(3);
    });

    it('should generate comments analytics', async () => {
      const propertyId = 'property-1';
      
      // Create comments
      const comment1 = await notesService.createComment({
        propertyId,
        content: 'First comment'
      });

      const comment2 = await notesService.createComment({
        propertyId,
        content: 'Second comment'
      });

      // Approve one comment
      await notesService.approveComment(comment1.id);

      // Like one comment
      await notesService.likeComment(comment1.id);
      await notesService.likeComment(comment1.id);

      const analytics = await notesService.getCommentsAnalytics(propertyId);

      expect(analytics.totalComments).toBe(2);
      expect(analytics.approvedComments).toBe(1);
      expect(analytics.pendingComments).toBe(1);
      expect(analytics.engagementMetrics.totalLikes).toBe(2);
      expect(analytics.engagementMetrics.averageLikesPerComment).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when getting non-existent note', async () => {
      await expect(notesService.getNote('non-existent-id')).rejects.toThrow('Note not found');
    });

    it('should throw error when updating non-existent note', async () => {
      const updateData: UpdateNoteRequest = {
        title: 'Updated Title'
      };

      await expect(notesService.updateNote('non-existent-id', updateData)).rejects.toThrow('Note not found');
    });

    it('should throw error when deleting non-existent note', async () => {
      await expect(notesService.deleteNote('non-existent-id')).rejects.toThrow('Note not found');
    });

    it('should throw error when getting non-existent comment', async () => {
      await expect(notesService.getComment('non-existent-id')).rejects.toThrow('Comment not found');
    });

    it('should throw error when updating non-existent comment', async () => {
      const updateData: UpdateCommentRequest = {
        content: 'Updated content'
      };

      await expect(notesService.updateComment('non-existent-id', updateData)).rejects.toThrow('Comment not found');
    });

    it('should throw error when deleting non-existent comment', async () => {
      await expect(notesService.deleteComment('non-existent-id')).rejects.toThrow('Comment not found');
    });
  });

  describe('Filtering and Search', () => {
    beforeEach(async () => {
      // Create test data
      await notesService.createNote({
        propertyId: 'property-1',
        title: 'Private Note',
        content: 'This is a private note',
        type: NoteType.PERSONAL,
        isPrivate: true,
        tags: ['private']
      });

      await notesService.createNote({
        propertyId: 'property-1',
        title: 'Public Note',
        content: 'This is a public note',
        type: NoteType.GENERAL,
        isPrivate: false,
        tags: ['public']
      });

      await notesService.createNote({
        propertyId: 'property-2',
        title: 'Another Property Note',
        content: 'Note for different property',
        type: NoteType.FINANCIAL,
        isPrivate: true,
        tags: ['financial']
      });
    });

    it('should filter notes by type', async () => {
      const filter = { type: NoteType.PERSONAL };
      const notes = await notesService.getNotesByProperty('property-1', filter);

      expect(notes).toHaveLength(1);
      expect(notes[0].type).toBe(NoteType.PERSONAL);
    });

    it('should filter notes by privacy', async () => {
      const filter = { isPrivate: true };
      const notes = await notesService.getNotesByProperty('property-1', filter);

      expect(notes).toHaveLength(1);
      expect(notes[0].isPrivate).toBe(true);
    });

    it('should filter notes by tags', async () => {
      const filter = { tags: ['private'] };
      const notes = await notesService.getNotesByProperty('property-1', filter);

      expect(notes).toHaveLength(1);
      expect(notes[0].tags).toContain('private');
    });

    it('should search notes by content', async () => {
      const results = await notesService.searchNotes('private');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Private Note');
    });

    it('should search notes by title', async () => {
      const results = await notesService.searchNotes('Public');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Public Note');
    });

    it('should search notes by tags', async () => {
      const results = await notesService.searchNotes('financial');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Another Property Note');
    });
  });
});
