'use client';

import React, { useState } from 'react';
import { PropertySocialData, ReactionType } from '@/types/social';
import { Button } from '../ui/Button';

interface PropertySocialFeedProps {
  socialData: PropertySocialData;
  onReaction: (reactionType: string) => void;
  onRemoveReaction: (reactionType: string) => void;
  onUpdateComment: (commentId: string, updates: any) => void;
  onDeleteComment: (commentId: string) => void;
  onUpdateFollow: (followId: string, updates: any) => void;
  onDeleteFollow: (followId: string) => void;
  isLoading?: boolean;
}

export function PropertySocialFeed({ 
  socialData, 
  onReaction, 
  onRemoveReaction,
  onUpdateComment,
  onDeleteComment,
  onUpdateFollow,
  onDeleteFollow,
  isLoading = false 
}: PropertySocialFeedProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [editingComment, setEditingComment] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getReactionIcon = (reactionType: string) => {
    const iconMap: { [key: string]: string } = {
      'like': '👍',
      'love': '❤️',
      'wow': '😮',
      'interested': '👀',
      'not_interested': '👎',
      'bookmark': '🔖',
      'share': '📤'
    };
    return iconMap[reactionType] || '👍';
  };

  const getReactionColor = (reactionType: string) => {
    const colorMap: { [key: string]: string } = {
      'like': 'bg-blue-100 text-blue-800',
      'love': 'bg-red-100 text-red-800',
      'wow': 'bg-yellow-100 text-yellow-800',
      'interested': 'bg-green-100 text-green-800',
      'not_interested': 'bg-gray-100 text-gray-800',
      'bookmark': 'bg-purple-100 text-purple-800',
      'share': 'bg-indigo-100 text-indigo-800'
    };
    return colorMap[reactionType] || 'bg-gray-100 text-gray-800';
  };

  const toggleCommentExpansion = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const handleReactionClick = (reactionType: string) => {
    const userReaction = socialData.reactions.find(r => 
      r.reactionType === reactionType && r.userId === 'mock-user-123'
    );

    if (userReaction) {
      onRemoveReaction(reactionType);
    } else {
      onReaction(reactionType);
    }
  };

  const getReactionCount = (reactionType: string) => {
    return socialData.reactions.filter(r => r.reactionType === reactionType).length;
  };

  const getUserReaction = (reactionType: string) => {
    return socialData.reactions.find(r => 
      r.reactionType === reactionType && r.userId === 'mock-user-123'
    );
  };

  const reactionTypes: ReactionType[] = [
    ReactionType.LIKE,
    ReactionType.LOVE,
    ReactionType.WOW,
    ReactionType.INTERESTED,
    ReactionType.BOOKMARK
  ];

  return (
    <div className="space-y-6">
      {/* Reaction Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reactions</h3>
        <div className="flex flex-wrap gap-2">
          {reactionTypes.map((reactionType) => {
            const count = getReactionCount(reactionType);
            const userReacted = getUserReaction(reactionType);
            
            return (
              <button
                key={reactionType}
                onClick={() => handleReactionClick(reactionType)}
                disabled={isLoading}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  userReacted 
                    ? getReactionColor(reactionType)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{getReactionIcon(reactionType)}</span>
                <span className="capitalize">{reactionType.replace('_', ' ')}</span>
                {count > 0 && (
                  <span className="ml-1 bg-white bg-opacity-50 px-1.5 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Comments ({socialData.comments.length})
          </h3>
        </div>

        {socialData.comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h4>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to share your thoughts about this property.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {socialData.comments.map((comment) => {
              const isExpanded = expandedComments.has(comment.id);
              const isEditing = editingComment === comment.id;
              
              return (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {comment.userId.charAt(comment.userId.length - 1)}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          User {comment.userId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.isEdited && (
                          <span className="text-xs text-gray-400">(edited)</span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-2">
                          <textarea
                            defaultValue={comment.content}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                          <div className="mt-2 flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                // Handle save
                                setEditingComment(null);
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingComment(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      )}

                      {/* Comment Actions */}
                      <div className="mt-2 flex items-center space-x-4">
                        <button
                          onClick={() => setEditingComment(comment.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                        {comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleCommentExpansion(comment.id)}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            {isExpanded ? 'Hide' : 'Show'} {comment.replies.length} replies
                          </button>
                        )}
                      </div>

                      {/* Replies */}
                      {isExpanded && comment.replies.length > 0 && (
                        <div className="mt-4 ml-4 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    {reply.userId.charAt(reply.userId.length - 1)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-medium text-gray-900">
                                    User {reply.userId}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shares Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Shares ({socialData.shares.length})
        </h3>

        {socialData.shares.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h4 className="mt-2 text-sm font-medium text-gray-900">No shares yet</h4>
            <p className="mt-1 text-sm text-gray-500">
              Share this property to help others discover it.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {socialData.shares.slice(0, 5).map((share) => (
              <div key={share.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Shared via {share.shareMethod.replace('_', ' ')} by User {share.sharedBy}
                  </p>
                  {share.message && (
                    <p className="text-xs text-gray-600 mt-1">"{share.message}"</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(share.createdAt)} • {share.metadata.viewCount} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Followers Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Followers ({socialData.follows.length})
        </h3>

        {socialData.follows.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="mt-2 text-sm font-medium text-gray-900">No followers yet</h4>
            <p className="mt-1 text-sm text-gray-500">
              Follow this property to get updates on price changes and new information.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {socialData.follows.map((follow) => (
              <div key={follow.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    User {follow.userId}
                  </p>
                  <p className="text-xs text-gray-500">
                    Following since {formatDate(follow.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {follow.followType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
