// Property Notes and Comments System - Main Component

'use client';

import React, { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useComments } from '@/hooks/useComments';
import { useNotesAnalytics } from '@/hooks/useNotesAnalytics';
import { useCommentsAnalytics } from '@/hooks/useCommentsAnalytics';
import { PropertyNote, PropertyComment, NoteType } from '@/types/notes';
import { CreateNoteModal } from './Notes/CreateNoteModal';
import { CreateCommentModal } from './Notes/CreateCommentModal';
import { NotesList } from './Notes/NotesList';
import { CommentsList } from './Notes/CommentsList';
import { NotesAnalytics } from './Notes/NotesAnalytics';
import { CommentsAnalytics } from './Notes/CommentsAnalytics';
import { NotesFilters } from './Notes/NotesFilters';
import { CommentsFilters } from './Notes/CommentsFilters';

interface PropertyNotesProps {
  propertyId: string;
  className?: string;
}

type TabType = 'notes' | 'comments' | 'analytics';

export const PropertyNotes: React.FC<PropertyNotesProps> = ({ 
  propertyId, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showCreateCommentModal, setShowCreateCommentModal] = useState(false);
  const [editingNote, setEditingNote] = useState<PropertyNote | null>(null);
  const [editingComment, setEditingComment] = useState<PropertyComment | null>(null);
  const [notesFilter, setNotesFilter] = useState({
    type: undefined as NoteType | undefined,
    isPrivate: undefined as boolean | undefined,
    search: ''
  });
  const [commentsFilter, setCommentsFilter] = useState({
    isApproved: undefined as boolean | undefined,
    search: ''
  });

  const { 
    notes, 
    loading: notesLoading, 
    error: notesError,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes
  } = useNotes(propertyId, notesFilter);

  const { 
    comments, 
    loading: commentsLoading, 
    error: commentsError,
    createComment,
    updateComment,
    deleteComment,
    approveComment,
    moderateComment,
    likeComment,
    dislikeComment,
    refreshComments
  } = useComments(propertyId, commentsFilter);

  const { 
    analytics: notesAnalytics, 
    loading: notesAnalyticsLoading 
  } = useNotesAnalytics(propertyId);

  const { 
    analytics: commentsAnalytics, 
    loading: commentsAnalyticsLoading 
  } = useCommentsAnalytics(propertyId);

  const handleCreateNote = async (noteData: any) => {
    try {
      await createNote({
        ...noteData,
        propertyId
      });
      setShowCreateNoteModal(false);
      await refreshNotes();
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdateNote = async (noteData: any) => {
    if (!editingNote) return;
    
    try {
      await updateNote(editingNote.id, noteData);
      setEditingNote(null);
      await refreshNotes();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      await refreshNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleCreateComment = async (commentData: any) => {
    try {
      await createComment({
        ...commentData,
        propertyId
      });
      setShowCreateCommentModal(false);
      await refreshComments();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleUpdateComment = async (commentData: any) => {
    if (!editingComment) return;
    
    try {
      await updateComment(editingComment.id, commentData);
      setEditingComment(null);
      await refreshComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await refreshComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      await approveComment(commentId);
      await refreshComments();
    } catch (error) {
      console.error('Failed to approve comment:', error);
    }
  };

  const handleModerateComment = async (commentId: string, reason: string) => {
    try {
      await moderateComment(commentId, reason);
      await refreshComments();
    } catch (error) {
      console.error('Failed to moderate comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(commentId);
      await refreshComments();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    try {
      await dislikeComment(commentId);
      await refreshComments();
    } catch (error) {
      console.error('Failed to dislike comment:', error);
    }
  };

  const tabs = [
    { id: 'notes', label: 'Notes', count: notes.length },
    { id: 'comments', label: 'Comments', count: comments.length },
    { id: 'analytics', label: 'Analytics', count: null }
  ] as const;

  return (
    <div className={`property-notes ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Property Notes & Comments</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateNoteModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Note
          </button>
          <button
            onClick={() => setShowCreateCommentModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Comment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <NotesFilters
              filter={notesFilter}
              onFilterChange={setNotesFilter}
            />
            <NotesList
              notes={notes}
              loading={notesLoading}
              error={notesError}
              onEdit={setEditingNote}
              onDelete={handleDeleteNote}
            />
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            <CommentsFilters
              filter={commentsFilter}
              onFilterChange={setCommentsFilter}
            />
            <CommentsList
              comments={comments}
              loading={commentsLoading}
              error={commentsError}
              onEdit={setEditingComment}
              onDelete={handleDeleteComment}
              onApprove={handleApproveComment}
              onModerate={handleModerateComment}
              onLike={handleLikeComment}
              onDislike={handleDislikeComment}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotesAnalytics
              analytics={notesAnalytics}
              loading={notesAnalyticsLoading}
            />
            <CommentsAnalytics
              analytics={commentsAnalytics}
              loading={commentsAnalyticsLoading}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateNoteModal && (
        <CreateNoteModal
          isOpen={showCreateNoteModal}
          onClose={() => setShowCreateNoteModal(false)}
          onSubmit={handleCreateNote}
        />
      )}

      {editingNote && (
        <CreateNoteModal
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          onSubmit={handleUpdateNote}
          initialData={editingNote}
          isEditing={true}
        />
      )}

      {showCreateCommentModal && (
        <CreateCommentModal
          isOpen={showCreateCommentModal}
          onClose={() => setShowCreateCommentModal(false)}
          onSubmit={handleCreateComment}
        />
      )}

      {editingComment && (
        <CreateCommentModal
          isOpen={!!editingComment}
          onClose={() => setEditingComment(null)}
          onSubmit={handleUpdateComment}
          initialData={editingComment}
          isEditing={true}
        />
      )}
    </div>
  );
};
