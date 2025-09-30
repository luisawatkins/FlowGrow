'use client';

import React, { useState } from 'react';
import { PropertySocialData } from '@/types/social';
import { usePropertySocial } from '@/hooks/usePropertySocial';
import { PropertySocialFeed } from './PropertySocial/PropertySocialFeed';
import { PropertySocialStats } from './PropertySocial/PropertySocialStats';
import { SharePropertyModal } from './PropertySocial/SharePropertyModal';
import { CommentModal } from './PropertySocial/CommentModal';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface PropertySocialProps {
  propertyId: string;
  onSocialChange?: (socialData: PropertySocialData | null) => void;
}

export function PropertySocial({ 
  propertyId, 
  onSocialChange 
}: PropertySocialProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'stats'>('feed');
  
  const {
    socialData,
    isLoading,
    error,
    createShare,
    createReaction,
    removeReaction,
    createComment,
    updateComment,
    deleteComment,
    createFollow,
    updateFollow,
    deleteFollow,
    loadSocialData,
    clearError
  } = usePropertySocial(propertyId, {
    autoRefresh: true,
    refreshInterval: 5,
    enableReactions: true,
    enableComments: true,
    enableShares: true,
    enableFollows: true
  });

  // Notify parent of social data changes
  React.useEffect(() => {
    onSocialChange?.(socialData);
  }, [socialData, onSocialChange]);

  const handleCreateShare = async (shareData: any) => {
    try {
      await createShare({
        ...shareData,
        propertyId
      });
      setShowShareModal(false);
    } catch (error) {
      console.error('Failed to create share:', error);
    }
  };

  const handleCreateReaction = async (reactionType: string) => {
    try {
      await createReaction({
        propertyId,
        reactionType: reactionType as any
      });
    } catch (error) {
      console.error('Failed to create reaction:', error);
    }
  };

  const handleRemoveReaction = async (reactionType: string) => {
    try {
      await removeReaction(propertyId, reactionType);
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  };

  const handleCreateComment = async (commentData: any) => {
    try {
      await createComment({
        ...commentData,
        propertyId
      });
      setShowCommentModal(false);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: string, updates: any) => {
    try {
      await updateComment(commentId, updates);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleCreateFollow = async (followData: any) => {
    try {
      await createFollow({
        ...followData,
        propertyId
      });
    } catch (error) {
      console.error('Failed to create follow:', error);
    }
  };

  const handleUpdateFollow = async (followId: string, updates: any) => {
    try {
      await updateFollow(followId, updates);
    } catch (error) {
      console.error('Failed to update follow:', error);
    }
  };

  const handleDeleteFollow = async (followId: string) => {
    try {
      await deleteFollow(followId);
    } catch (error) {
      console.error('Failed to delete follow:', error);
    }
  };

  if (isLoading && !socialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading social data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={clearError}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!socialData) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No social activity</h3>
        <p className="mt-1 text-sm text-gray-500">
          This property doesn't have any social activity yet.
        </p>
        <div className="mt-6 flex justify-center space-x-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share Property
          </button>
          <button
            onClick={() => setShowCommentModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Add Comment
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Social</h1>
              <p className="mt-1 text-sm text-gray-500">
                Share, react, comment, and follow this property
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
              <button
                onClick={() => setShowCommentModal(true)}
                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comment
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{socialData.stats.totalShares}</div>
            <div className="text-sm text-gray-500">Shares</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{socialData.stats.totalReactions}</div>
            <div className="text-sm text-gray-500">Reactions</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{socialData.stats.totalComments}</div>
            <div className="text-sm text-gray-500">Comments</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{socialData.stats.totalFollows}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'feed', name: 'Activity Feed', icon: '📱' },
              { id: 'stats', name: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === 'feed' && (
            <PropertySocialFeed
              socialData={socialData}
              onReaction={handleCreateReaction}
              onRemoveReaction={handleRemoveReaction}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
              onUpdateFollow={handleUpdateFollow}
              onDeleteFollow={handleDeleteFollow}
              isLoading={isLoading}
            />
          )}
          
          {activeTab === 'stats' && (
            <PropertySocialStats
              propertyId={propertyId}
              socialData={socialData}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <SharePropertyModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            onShare={handleCreateShare}
            propertyId={propertyId}
          />
        )}

        {/* Comment Modal */}
        {showCommentModal && (
          <CommentModal
            isOpen={showCommentModal}
            onClose={() => setShowCommentModal(false)}
            onComment={handleCreateComment}
            propertyId={propertyId}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
