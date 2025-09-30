// Property Comments Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  PropertyComment, 
  CreateCommentRequest, 
  UpdateCommentRequest, 
  CommentsFilter,
  UseCommentsReturn,
  NotesError 
} from '@/types/notes';
import { notesService } from '@/lib/notesService';

export const useComments = (propertyId?: string, filter?: CommentsFilter): UseCommentsReturn => {
  const [comments, setComments] = useState<PropertyComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NotesError | null>(null);

  const loadComments = useCallback(async () => {
    if (!propertyId) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedComments = await notesService.getCommentsByProperty(propertyId, filter);
      setComments(fetchedComments);
    } catch (err) {
      setError(err as NotesError);
    } finally {
      setLoading(false);
    }
  }, [propertyId, filter]);

  const createComment = useCallback(async (request: CreateCommentRequest): Promise<PropertyComment> => {
    try {
      setError(null);
      const newComment = await notesService.createComment(request);
      setComments(prev => [newComment, ...prev]);
      return newComment;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const updateComment = useCallback(async (id: string, request: UpdateCommentRequest): Promise<PropertyComment> => {
    try {
      setError(null);
      const updatedComment = await notesService.updateComment(id, request);
      setComments(prev => updateCommentInTree(prev, id, updatedComment));
      return updatedComment;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const deleteComment = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await notesService.deleteComment(id);
      setComments(prev => removeCommentFromTree(prev, id));
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const getComment = useCallback(async (id: string): Promise<PropertyComment> => {
    try {
      setError(null);
      return await notesService.getComment(id);
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const getCommentsByProperty = useCallback(async (propertyId: string, filter?: CommentsFilter): Promise<PropertyComment[]> => {
    try {
      setError(null);
      return await notesService.getCommentsByProperty(propertyId, filter);
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const approveComment = useCallback(async (id: string): Promise<PropertyComment> => {
    try {
      setError(null);
      const approvedComment = await notesService.approveComment(id);
      setComments(prev => updateCommentInTree(prev, id, approvedComment));
      return approvedComment;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const moderateComment = useCallback(async (id: string, reason: string): Promise<PropertyComment> => {
    try {
      setError(null);
      const moderatedComment = await notesService.moderateComment(id, reason);
      setComments(prev => updateCommentInTree(prev, id, moderatedComment));
      return moderatedComment;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const likeComment = useCallback(async (id: string): Promise<PropertyComment> => {
    try {
      setError(null);
      const likedComment = await notesService.likeComment(id);
      setComments(prev => updateCommentInTree(prev, id, likedComment));
      return likedComment;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const dislikeComment = useCallback(async (id: string): Promise<PropertyComment> => {
    try {
      setError(null);
      const dislikedComment = await notesService.dislikeComment(id);
      setComments(prev => updateCommentInTree(prev, id, dislikedComment));
      return dislikedComment;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const refreshComments = useCallback(async (): Promise<void> => {
    await loadComments();
  }, [loadComments]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    getComment,
    getCommentsByProperty,
    approveComment,
    moderateComment,
    likeComment,
    dislikeComment,
    refreshComments
  };
};

// Helper functions for comment tree manipulation
const updateCommentInTree = (comments: PropertyComment[], id: string, updatedComment: PropertyComment): PropertyComment[] => {
  return comments.map(comment => {
    if (comment.id === id) {
      return updatedComment;
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, id, updatedComment)
      };
    }
    return comment;
  });
};

const removeCommentFromTree = (comments: PropertyComment[], id: string): PropertyComment[] => {
  return comments
    .filter(comment => comment.id !== id)
    .map(comment => ({
      ...comment,
      replies: comment.replies.length > 0 ? removeCommentFromTree(comment.replies, id) : []
    }));
};
