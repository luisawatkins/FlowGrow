// Comments List Component

'use client';

import React, { useState } from 'react';
import { PropertyComment } from '@/types/notes';

interface CommentsListProps {
  comments: PropertyComment[];
  loading: boolean;
  error: any;
  onEdit: (comment: PropertyComment) => void;
  onDelete: (commentId: string) => void;
  onApprove: (commentId: string) => void;
  onModerate: (commentId: string, reason: string) => void;
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  loading,
  error,
  onEdit,
  onDelete,
  onApprove,
  onModerate,
  onLike,
  onDislike
}) => {
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState('');

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusColor = (comment: PropertyComment): string => {
    if (comment.isModerated) return 'bg-red-100 text-red-800';
    if (!comment.isApproved) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (comment: PropertyComment): string => {
    if (comment.isModerated) return 'Moderated';
    if (!comment.isApproved) return 'Pending';
    return 'Approved';
  };

  const handleModerate = (commentId: string) => {
    if (moderationReason.trim()) {
      onModerate(commentId, moderationReason);
      setModerationReason('');
    }
  };

  const renderComment = (comment: PropertyComment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">User {comment.userId}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment)}`}>
                {getStatusText(comment)}
              </span>
              {comment.metadata?.isHighlighted && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatDate(comment.createdAt)}</span>
              {comment.metadata?.isEdited && (
                <>
                  <span>•</span>
                  <span>Edited</span>
                </>
              )}
              {comment.metadata?.editHistory && comment.metadata.editHistory.length > 0 && (
                <>
                  <span>•</span>
                  <span>{comment.metadata.editHistory.length} edit(s)</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!comment.isApproved && !comment.isModerated && (
              <button
                onClick={() => onApprove(comment.id)}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Approve comment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            {!comment.isModerated && (
              <button
                onClick={() => onEdit(comment)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit comment"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onDelete(comment.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete comment"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          {comment.isModerated && comment.moderationReason && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              <strong>Moderation reason:</strong> {comment.moderationReason}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V5a2 2 0 012-2h4.343a2 2 0 011.414.586l4.657 4.657a2 2 0 01.586 1.414V16a2 2 0 01-2 2H9a2 2 0 01-2-2V10z" />
              </svg>
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => onDislike(comment.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 8V6m7 8a2 2 0 012 2v3a2 2 0 01-2 2H9a2 2 0 01-2-2v-3a2 2 0 012-2h4.343a2 2 0 011.414-.586l4.657-4.657a2 2 0 01.586-1.414V4a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2h4z" />
              </svg>
              <span>{comment.dislikes}</span>
            </button>
            {depth === 0 && (
              <button
                onClick={() => setShowReplyForm(showReplyForm === comment.id ? null : comment.id)}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                Reply
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {comment.metadata?.wordCount || 0} words
          </div>
        </div>

        {/* Moderation Form */}
        {!comment.isModerated && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                placeholder="Reason for moderation..."
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={() => handleModerate(comment.id)}
                disabled={!moderationReason.trim()}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Moderate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
          <p className="text-red-800">Failed to load comments: {error.message}</p>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
        <p className="mt-1 text-sm text-gray-500">Be the first to share your thoughts about this property.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => renderComment(comment))}
    </div>
  );
};
