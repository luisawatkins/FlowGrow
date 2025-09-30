import { socialService } from '../../lib/socialService';
import { ShareType, ShareMethod, ReactionType, FollowType } from '../../types/social';

// Mock data for testing
const mockUserId = 'test-user-123';

describe('SocialService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    jest.clearAllMocks();
  });

  describe('Share Management', () => {
    it('should create a new share', async () => {
      const shareRequest = {
        propertyId: '1',
        shareType: ShareType.DIRECT,
        shareMethod: ShareMethod.EMAIL,
        sharedWith: ['user1@example.com', 'user2@example.com'],
        message: 'Check out this amazing property!',
        isPublic: false,
        allowComments: true,
        allowReactions: true
      };

      const response = await socialService.createShare(shareRequest, mockUserId);

      expect(response.success).toBe(true);
      expect(response.share).toBeDefined();
      expect(response.share.propertyId).toBe('1');
      expect(response.share.sharedBy).toBe(mockUserId);
      expect(response.share.shareType).toBe(ShareType.DIRECT);
      expect(response.share.shareMethod).toBe(ShareMethod.EMAIL);
      expect(response.share.sharedWith).toEqual(['user1@example.com', 'user2@example.com']);
      expect(response.share.message).toBe('Check out this amazing property!');
    });

    it('should update an existing share', async () => {
      // First create a share
      const createRequest = {
        propertyId: '1',
        shareType: ShareType.DIRECT,
        shareMethod: ShareMethod.EMAIL,
        sharedWith: ['user1@example.com'],
        message: 'Original message'
      };

      const createResponse = await socialService.createShare(createRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then update it
      const updateRequest = {
        message: 'Updated message',
        isPublic: true
      };

      const updateResponse = await socialService.updateShare(
        createResponse.share!.id,
        updateRequest,
        mockUserId
      );

      expect(updateResponse.success).toBe(true);
      expect(updateResponse.share!.message).toBe('Updated message');
      expect(updateResponse.share!.isPublic).toBe(true);
    });

    it('should delete a share', async () => {
      // First create a share
      const createRequest = {
        propertyId: '1',
        shareType: ShareType.DIRECT,
        shareMethod: ShareMethod.EMAIL,
        sharedWith: ['user1@example.com']
      };

      const createResponse = await socialService.createShare(createRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then delete it
      const deleteResponse = await socialService.deleteShare(
        createResponse.share!.id,
        mockUserId
      );

      expect(deleteResponse.success).toBe(true);
    });

    it('should not allow updating/deleting shares from other users', async () => {
      const shareRequest = {
        propertyId: '1',
        shareType: ShareType.DIRECT,
        shareMethod: ShareMethod.EMAIL,
        sharedWith: ['user1@example.com']
      };

      const createResponse = await socialService.createShare(shareRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Try to update with different user
      const updateResponse = await socialService.updateShare(
        createResponse.share!.id,
        { message: 'Hacked message' },
        'different-user'
      );

      expect(updateResponse.success).toBe(false);
      expect(updateResponse.message).toBe('Share not found');
    });
  });

  describe('Reaction Management', () => {
    it('should create a new reaction', async () => {
      const reactionRequest = {
        propertyId: '1',
        reactionType: ReactionType.LIKE
      };

      const response = await socialService.createReaction(reactionRequest, mockUserId);

      expect(response.success).toBe(true);
      expect(response.reaction).toBeDefined();
      expect(response.reaction.propertyId).toBe('1');
      expect(response.reaction.userId).toBe(mockUserId);
      expect(response.reaction.reactionType).toBe(ReactionType.LIKE);
    });

    it('should not create duplicate reactions', async () => {
      const reactionRequest = {
        propertyId: '1',
        reactionType: ReactionType.LIKE
      };

      // Create first reaction
      const firstResponse = await socialService.createReaction(reactionRequest, mockUserId);
      expect(firstResponse.success).toBe(true);

      // Try to create duplicate
      const secondResponse = await socialService.createReaction(reactionRequest, mockUserId);
      expect(secondResponse.success).toBe(true);
      expect(secondResponse.reaction.id).toBe(firstResponse.reaction.id);
    });

    it('should remove a reaction', async () => {
      const reactionRequest = {
        propertyId: '1',
        reactionType: ReactionType.LOVE
      };

      // Create reaction
      const createResponse = await socialService.createReaction(reactionRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Remove reaction
      const removeResponse = await socialService.removeReaction(
        '1',
        ReactionType.LOVE,
        mockUserId
      );

      expect(removeResponse.success).toBe(true);
    });

    it('should handle removing non-existent reaction', async () => {
      const removeResponse = await socialService.removeReaction(
        '1',
        ReactionType.WOW,
        mockUserId
      );

      expect(removeResponse.success).toBe(false);
      expect(removeResponse.message).toBe('Reaction not found');
    });
  });

  describe('Comment Management', () => {
    it('should create a new comment', async () => {
      const commentRequest = {
        propertyId: '1',
        content: 'This property looks amazing!',
        isPublic: true
      };

      const response = await socialService.createComment(commentRequest, mockUserId);

      expect(response.success).toBe(true);
      expect(response.comment).toBeDefined();
      expect(response.comment.propertyId).toBe('1');
      expect(response.comment.userId).toBe(mockUserId);
      expect(response.comment.content).toBe('This property looks amazing!');
      expect(response.comment.isPublic).toBe(true);
    });

    it('should create a reply to a comment', async () => {
      // First create a parent comment
      const parentRequest = {
        propertyId: '1',
        content: 'Parent comment',
        isPublic: true
      };

      const parentResponse = await socialService.createComment(parentRequest, mockUserId);
      expect(parentResponse.success).toBe(true);

      // Then create a reply
      const replyRequest = {
        propertyId: '1',
        content: 'This is a reply',
        parentId: parentResponse.comment!.id,
        isPublic: true
      };

      const replyResponse = await socialService.createComment(replyRequest, mockUserId);

      expect(replyResponse.success).toBe(true);
      expect(replyResponse.comment.parentId).toBe(parentResponse.comment!.id);
    });

    it('should update a comment', async () => {
      // First create a comment
      const createRequest = {
        propertyId: '1',
        content: 'Original comment',
        isPublic: true
      };

      const createResponse = await socialService.createComment(createRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then update it
      const updateRequest = {
        content: 'Updated comment',
        isPublic: false
      };

      const updateResponse = await socialService.updateComment(
        createResponse.comment!.id,
        updateRequest,
        mockUserId
      );

      expect(updateResponse.success).toBe(true);
      expect(updateResponse.comment!.content).toBe('Updated comment');
      expect(updateResponse.comment!.isPublic).toBe(false);
      expect(updateResponse.comment!.isEdited).toBe(true);
    });

    it('should delete a comment', async () => {
      // First create a comment
      const createRequest = {
        propertyId: '1',
        content: 'Comment to delete',
        isPublic: true
      };

      const createResponse = await socialService.createComment(createRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then delete it
      const deleteResponse = await socialService.deleteComment(
        createResponse.comment!.id,
        mockUserId
      );

      expect(deleteResponse.success).toBe(true);
    });
  });

  describe('Follow Management', () => {
    it('should create a new follow', async () => {
      const followRequest = {
        propertyId: '1',
        followType: FollowType.PROPERTY,
        notifications: {
          priceChanges: true,
          statusChanges: true,
          newComments: false,
          newReactions: false,
          newShares: true,
          marketUpdates: true,
          weeklyDigest: false
        }
      };

      const response = await socialService.createFollow(followRequest, mockUserId);

      expect(response.success).toBe(true);
      expect(response.follow).toBeDefined();
      expect(response.follow.propertyId).toBe('1');
      expect(response.follow.userId).toBe(mockUserId);
      expect(response.follow.followType).toBe(FollowType.PROPERTY);
      expect(response.follow.notifications.priceChanges).toBe(true);
    });

    it('should not create duplicate follows', async () => {
      const followRequest = {
        propertyId: '1',
        followType: FollowType.PROPERTY
      };

      // Create first follow
      const firstResponse = await socialService.createFollow(followRequest, mockUserId);
      expect(firstResponse.success).toBe(true);

      // Try to create duplicate
      const secondResponse = await socialService.createFollow(followRequest, mockUserId);
      expect(secondResponse.success).toBe(true);
      expect(secondResponse.follow.id).toBe(firstResponse.follow.id);
    });

    it('should update follow notifications', async () => {
      // First create a follow
      const createRequest = {
        propertyId: '1',
        followType: FollowType.PROPERTY
      };

      const createResponse = await socialService.createFollow(createRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then update notifications
      const updateRequest = {
        notifications: {
          priceChanges: false,
          newComments: true
        }
      };

      const updateResponse = await socialService.updateFollow(
        createResponse.follow!.id,
        updateRequest,
        mockUserId
      );

      expect(updateResponse.success).toBe(true);
      expect(updateResponse.follow!.notifications.priceChanges).toBe(false);
      expect(updateResponse.follow!.notifications.newComments).toBe(true);
    });

    it('should delete a follow', async () => {
      // First create a follow
      const createRequest = {
        propertyId: '1',
        followType: FollowType.PROPERTY
      };

      const createResponse = await socialService.createFollow(createRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then delete it
      const deleteResponse = await socialService.deleteFollow(
        createResponse.follow!.id,
        mockUserId
      );

      expect(deleteResponse.success).toBe(true);
    });
  });

  describe('Social Data Retrieval', () => {
    it('should get property social data', async () => {
      // Create some test data
      await socialService.createShare({
        propertyId: '1',
        shareType: ShareType.DIRECT,
        shareMethod: ShareMethod.EMAIL,
        sharedWith: ['user1@example.com']
      }, mockUserId);

      await socialService.createReaction({
        propertyId: '1',
        reactionType: ReactionType.LIKE
      }, mockUserId);

      await socialService.createComment({
        propertyId: '1',
        content: 'Test comment',
        isPublic: true
      }, mockUserId);

      await socialService.createFollow({
        propertyId: '1',
        followType: FollowType.PROPERTY
      }, mockUserId);

      const response = await socialService.getPropertySocialData('1');

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.propertyId).toBe('1');
      expect(response.data.shares.length).toBeGreaterThan(0);
      expect(response.data.reactions.length).toBeGreaterThan(0);
      expect(response.data.comments.length).toBeGreaterThan(0);
      expect(response.data.follows.length).toBeGreaterThan(0);
      expect(response.data.stats).toBeDefined();
      expect(response.data.trending).toBeDefined();
    });

    it('should return empty data for non-existent property', async () => {
      const response = await socialService.getPropertySocialData('non-existent');

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.shares.length).toBe(0);
      expect(response.data.reactions.length).toBe(0);
      expect(response.data.comments.length).toBe(0);
      expect(response.data.follows.length).toBe(0);
    });
  });

  describe('Social Profile Management', () => {
    it('should create a social profile', async () => {
      const profileRequest = {
        displayName: 'Test User',
        bio: 'Test bio',
        location: 'Test City',
        website: 'https://test.com',
        socialLinks: {
          twitter: '@testuser',
          linkedin: 'testuser'
        }
      };

      const response = await socialService.createSocialProfile(profileRequest, mockUserId);

      expect(response.success).toBe(true);
      expect(response.profile).toBeDefined();
      expect(response.profile.userId).toBe(mockUserId);
      expect(response.profile.displayName).toBe('Test User');
      expect(response.profile.bio).toBe('Test bio');
      expect(response.profile.location).toBe('Test City');
      expect(response.profile.website).toBe('https://test.com');
    });

    it('should update a social profile', async () => {
      // First create a profile
      const createRequest = {
        displayName: 'Original Name',
        bio: 'Original bio'
      };

      const createResponse = await socialService.createSocialProfile(createRequest, mockUserId);
      expect(createResponse.success).toBe(true);

      // Then update it
      const updateRequest = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
        location: 'New City'
      };

      const updateResponse = await socialService.updateSocialProfile(mockUserId, updateRequest);

      expect(updateResponse.success).toBe(true);
      expect(updateResponse.profile!.displayName).toBe('Updated Name');
      expect(updateResponse.profile!.bio).toBe('Updated bio');
      expect(updateResponse.profile!.location).toBe('New City');
    });

    it('should get a social profile', async () => {
      // First create a profile
      const createRequest = {
        displayName: 'Test User',
        bio: 'Test bio'
      };

      await socialService.createSocialProfile(createRequest, mockUserId);

      // Then get it
      const getResponse = await socialService.getSocialProfile(mockUserId);

      expect(getResponse.success).toBe(true);
      expect(getResponse.profile).toBeDefined();
      expect(getResponse.profile!.userId).toBe(mockUserId);
      expect(getResponse.profile!.displayName).toBe('Test User');
    });

    it('should return error for non-existent profile', async () => {
      const response = await socialService.getSocialProfile('non-existent-user');

      expect(response.success).toBe(false);
      expect(response.message).toBe('Social profile not found');
    });
  });

  describe('Analytics', () => {
    it('should generate social analytics', async () => {
      // Create some test data
      await socialService.createShare({
        propertyId: '1',
        shareType: ShareType.DIRECT,
        shareMethod: ShareMethod.EMAIL,
        sharedWith: ['user1@example.com']
      }, mockUserId);

      await socialService.createReaction({
        propertyId: '1',
        reactionType: ReactionType.LIKE
      }, mockUserId);

      await socialService.createComment({
        propertyId: '1',
        content: 'Test comment',
        isPublic: true
      }, mockUserId);

      const analytics = await socialService.getSocialAnalytics('1', 'week');

      expect(analytics).toBeDefined();
      expect(analytics!.propertyId).toBe('1');
      expect(analytics!.period).toBe('week');
      expect(analytics!.totalShares).toBeGreaterThan(0);
      expect(analytics!.totalReactions).toBeGreaterThan(0);
      expect(analytics!.totalComments).toBeGreaterThan(0);
      expect(analytics!.engagementRate).toBeGreaterThanOrEqual(0);
      expect(analytics!.topReactions).toBeDefined();
      expect(analytics!.topCommenters).toBeDefined();
      expect(analytics!.topSharers).toBeDefined();
      expect(analytics!.activityTrend).toBeDefined();
      expect(analytics!.demographicData).toBeDefined();
      expect(analytics!.insights).toBeDefined();
    });

    it('should return null for non-existent property analytics', async () => {
      const analytics = await socialService.getSocialAnalytics('non-existent', 'week');

      expect(analytics).toBeNull();
    });
  });

  describe('Search Functionality', () => {
    it('should search activities by property ID', async () => {
      // Create some test activities
      await socialService.createShare({
        propertyId: '1',
        shareType: ShareType.DIRECT,
        shareMethod: ShareMethod.EMAIL,
        sharedWith: ['user1@example.com']
      }, mockUserId);

      await socialService.createReaction({
        propertyId: '2',
        reactionType: ReactionType.LIKE
      }, mockUserId);

      const searchResponse = await socialService.searchActivities({
        propertyId: '1'
      });

      expect(searchResponse.activities.length).toBeGreaterThan(0);
      expect(searchResponse.activities.every(a => a.propertyId === '1')).toBe(true);
    });

    it('should search activities by user ID', async () => {
      const searchResponse = await socialService.searchActivities({
        userId: mockUserId
      });

      expect(searchResponse.activities.length).toBeGreaterThan(0);
      expect(searchResponse.activities.every(a => a.userId === mockUserId)).toBe(true);
    });

    it('should search activities by keywords', async () => {
      // Create a comment with specific content
      await socialService.createComment({
        propertyId: '1',
        content: 'This property has amazing views and great location',
        isPublic: true
      }, mockUserId);

      const searchResponse = await socialService.searchActivities({
        keywords: 'amazing views'
      });

      expect(searchResponse.activities.length).toBeGreaterThan(0);
      expect(searchResponse.activities.some(a => 
        a.content?.toLowerCase().includes('amazing views')
      )).toBe(true);
    });

    it('should search activities by date range', async () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const searchResponse = await socialService.searchActivities({
        dateRange: {
          start: oneWeekAgo,
          end: now
        }
      });

      expect(searchResponse.activities.length).toBeGreaterThan(0);
      expect(searchResponse.activities.every(a => {
        const activityDate = new Date(a.createdAt);
        return activityDate >= oneWeekAgo && activityDate <= now;
      })).toBe(true);
    });

    it('should return facets in search results', async () => {
      const searchResponse = await socialService.searchActivities({});

      expect(searchResponse.facets).toBeDefined();
      expect(searchResponse.facets.activityTypes).toBeDefined();
      expect(searchResponse.facets.users).toBeDefined();
      expect(searchResponse.facets.dateRanges).toBeDefined();
    });
  });
});
