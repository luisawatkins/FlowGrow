// Notes List Component

'use client';

import React from 'react';
import { PropertyNote, NoteType, NotePriority } from '@/types/notes';

interface NotesListProps {
  notes: PropertyNote[];
  loading: boolean;
  error: any;
  onEdit: (note: PropertyNote) => void;
  onDelete: (noteId: string) => void;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  loading,
  error,
  onEdit,
  onDelete
}) => {
  const getTypeColor = (type: NoteType): string => {
    const colors = {
      [NoteType.GENERAL]: 'bg-gray-100 text-gray-800',
      [NoteType.VIEWING]: 'bg-blue-100 text-blue-800',
      [NoteType.FINANCIAL]: 'bg-green-100 text-green-800',
      [NoteType.MAINTENANCE]: 'bg-yellow-100 text-yellow-800',
      [NoteType.MARKET]: 'bg-purple-100 text-purple-800',
      [NoteType.PERSONAL]: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || colors[NoteType.GENERAL];
  };

  const getPriorityColor = (priority: NotePriority): string => {
    const colors = {
      [NotePriority.LOW]: 'text-gray-500',
      [NotePriority.MEDIUM]: 'text-yellow-500',
      [NotePriority.HIGH]: 'text-orange-500',
      [NotePriority.URGENT]: 'text-red-500'
    };
    return colors[priority] || colors[NotePriority.MEDIUM];
  };

  const getPriorityIcon = (priority: NotePriority): string => {
    const icons = {
      [NotePriority.LOW]: '↓',
      [NotePriority.MEDIUM]: '→',
      [NotePriority.HIGH]: '↑',
      [NotePriority.URGENT]: '⚠'
    };
    return icons[priority] || icons[NotePriority.MEDIUM];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800">Failed to load notes: {error.message}</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first note.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                {note.metadata?.isPinned && (
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                  </svg>
                )}
                {note.isPrivate && (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(note.type)}`}>
                  {note.type}
                </span>
                <span className={`flex items-center gap-1 ${getPriorityColor(note.metadata?.priority || NotePriority.MEDIUM)}`}>
                  <span>{getPriorityIcon(note.metadata?.priority || NotePriority.MEDIUM)}</span>
                  {note.metadata?.priority || NotePriority.MEDIUM}
                </span>
                <span>•</span>
                <span>{formatDate(note.createdAt)}</span>
                {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                  <>
                    <span>•</span>
                    <span>Edited {formatDate(note.updatedAt)}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(note)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit note"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete note"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-3">
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
          </div>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>{note.metadata?.wordCount || 0} words</span>
            {note.metadata?.attachments && note.metadata.attachments.length > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {note.metadata.attachments.length} attachment(s)
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
