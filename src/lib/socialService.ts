import {
  PropertyShare,
  PropertyReaction,
  PropertyComment,
  PropertyFollow,
  SocialActivity,
  SocialProfile,
  PropertySocialData,
  CreateShareRequest,
  UpdateShareRequest,
  CreateReactionRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateFollowRequest,
  UpdateFollowRequest,
  CreateSocialProfileRequest,
  UpdateSocialProfileRequest,
  ShareResponse,
  ReactionResponse,
  CommentResponse,
  FollowResponse,
  SocialProfileResponse,
  PropertySocialDataResponse,
  SocialSearchQuery,
  SocialSearchResponse,
  SocialAnalytics,
  SocialExportOptions,
  ShareType,
  ShareMethod,
  ReactionType,
  FollowType,
  SocialActivityType,
  ModerationStatus,
  PrivacyLevel
} from '@/types/social';

// Mock data for development
const mockShares: PropertyShare[] = [
  {
    id: 'share-1',
    propertyId: '1',
    sharedBy: 'user-123',
    sharedWith: ['user-456', 'user-789'],
    shareType: ShareType.DIRECT,
    shareMethod: ShareMethod.EMAIL,
    message: 'Check out this amazing property!',
    isPublic: false,
    allowComments: true,
    allowReactions: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    metadata: {
      viewCount: 5,
      clickCount: 3,
      shareCount: 1,
      reactionCount: 2,
      commentCount: 1,
      lastViewedAt: new Date('2024-01-16T14:30:00Z'),
      lastClickedAt: new Date('2024-01-16T14:30:00Z')
    }
  }
];

const mockReactions: PropertyReaction[] = [
  {
    id: 'reaction-1',
    propertyId: '1',
    userId: 'user-456',
    reactionType: ReactionType.LIKE,
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: 'reaction-2',
    propertyId: '1',
    userId: 'user-789',
    reactionType: ReactionType.LOVE,
    createdAt: new Date('2024-01-15T12:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z')
  }
];

const mockComments: PropertyComment[] = [
  {
    id: 'comment-1',
    propertyId: '1',
    userId: 'user-456',
    content: 'This property looks amazing! The location is perfect.',
    isPublic: true,
    isEdited: false,
    createdAt: new Date('2024-01-15T13:00:00Z'),
    updatedAt: new Date('2024-01-15T13:00:00Z'),
    reactions: [],
    replies: [],
    metadata: {
      likeCount: 3,
      dislikeCount: 0,
      replyCount: 1,
      isPinned: false,
      isReported: false,
      moderationStatus: ModerationStatus.APPROVED
    }
  }
];

const mockFollows: PropertyFollow[] = [
  {
    id: 'follow-1',
    propertyId: '1',
    userId: 'user-456',
    followType: FollowType.PROPERTY,
    notifications: {
      priceChanges: true,
      statusChanges: true,
      newComments: false,
      newReactions: false,
      newShares: true,
      marketUpdates: true,
      weeklyDigest: false
    },
    createdAt: new Date('2024-01-15T14:00:00Z'),
    updatedAt: new Date('2024-01-15T14:00:00Z')
  }
];

const mockActivities: SocialActivity[] = [
  {
    id: 'activity-1',
    propertyId: '1',
    userId: 'user-123',
    activityType: SocialActivityType.SHARED,
    content: 'Shared this property with friends',
    metadata: {
      shareId: 'share-1',
      deviceType: 'mobile',
      location: 'San Francisco, CA'
    },
    isPublic: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  }
];

const mockProfiles: SocialProfile[] = [
  {
    id: 'profile-1',
    userId: 'user-123',
    displayName: 'John Smith',
    bio: 'Real estate enthusiast and property investor',
    avatar: '/avatars/user-123.jpg',
    location: 'San Francisco, CA',
    website: 'https://johnsmith.com',
    socialLinks: {
      twitter: '@johnsmith',
      linkedin: 'johnsmith',
      website: 'https://johnsmith.com'
    },
    preferences: {
      showActivity: true,
      showFavorites: true,
      showWishlists: false,
      allowDirectMessages: true,
      allowPropertyShares: true,
      allowComments: true,
      allowReactions: true,
      privacyLevel: PrivacyLevel.PUBLIC
    },
    stats: {
      propertiesShared: 15,
      propertiesFavorited: 42,
      commentsPosted: 28,
      reactionsGiven: 156,
      followersCount: 89,
      followingCount: 234,
      totalViews: 1250,
      totalShares: 45
    },
    isVerified: false,
    isPublic: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  }
];

class SocialService {
  private shares: PropertyShare[] = [...mockShares];
  private reactions: PropertyReaction[] = [...mockReactions];
  private comments: PropertyComment[] = [...mockComments];
  private follows: PropertyFollow[] = [...mockFollows];
  private activities: SocialActivity[] = [...mockActivities];
  private profiles: SocialProfile[] = [...mockProfiles];
  private nextId = 1000;

  /**
   * Create a new property share
   */
  async createShare(request: CreateShareRequest, userId: string): Promise<ShareResponse> {
    try {
      const share: PropertyShare = {
        id: `share-${this.nextId++}`,
        propertyId: request.propertyId,
        sharedBy: userId,
        sharedWith: request.sharedWith,
        shareType: request.shareType,
        shareMethod: request.shareMethod,
        message: request.message,
        expiresAt: request.expiresAt,
        isPublic: request.isPublic || false,
        allowComments: request.allowComments || true,
        allowReactions: request.allowReactions || true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          viewCount: 0,
          clickCount: 0,
          shareCount: 0,
          reactionCount: 0,
          commentCount: 0
        }
      };

      this.shares.push(share);

      // Create activity
      await this.createActivity({
        propertyId: request.propertyId,
        userId,
        activityType: SocialActivityType.SHARED,
        content: `Shared property via ${request.shareMethod}`,
        metadata: { shareId: share.id },
        isPublic: request.isPublic || false
      });

      return {
        share,
        success: true,
        message: 'Property shared successfully'
      };
    } catch (error) {
      return {
        share: null as any,
        success: false,
        message: 'Failed to create share'
      };
    }
  }

  /**
   * Update a property share
   */
  async updateShare(id: string, request: UpdateShareRequest, userId: string): Promise<ShareResponse> {
    try {
      const shareIndex = this.shares.findIndex(s => s.id === id && s.sharedBy === userId);
      
      if (shareIndex === -1) {
        return {
          share: null as any,
          success: false,
          message: 'Share not found'
        };
      }

      const share = this.shares[shareIndex];
      
      if (request.message !== undefined) share.message = request.message;
      if (request.expiresAt !== undefined) share.expiresAt = request.expiresAt;
      if (request.isPublic !== undefined) share.isPublic = request.isPublic;
      if (request.allowComments !== undefined) share.allowComments = request.allowComments;
      if (request.allowReactions !== undefined) share.allowReactions = request.allowReactions;
      
      share.updatedAt = new Date();
      this.shares[shareIndex] = share;

      return {
        share,
        success: true,
        message: 'Share updated successfully'
      };
    } catch (error) {
      return {
        share: null as any,
        success: false,
        message: 'Failed to update share'
      };
    }
  }

  /**
   * Delete a property share
   */
  async deleteShare(id: string, userId: string): Promise<ShareResponse> {
    try {
      const shareIndex = this.shares.findIndex(s => s.id === id && s.sharedBy === userId);
      
      if (shareIndex === -1) {
        return {
          share: null as any,
          success: false,
          message: 'Share not found'
        };
      }

      const share = this.shares[shareIndex];
      this.shares.splice(shareIndex, 1);

      return {
        share,
        success: true,
        message: 'Share deleted successfully'
      };
    } catch (error) {
      return {
        share: null as any,
        success: false,
        message: 'Failed to delete share'
      };
    }
  }

  /**
   * Create a property reaction
   */
  async createReaction(request: CreateReactionRequest, userId: string): Promise<ReactionResponse> {
    try {
      // Check if user already reacted with this type
      const existingReaction = this.reactions.find(
        r => r.propertyId === request.propertyId && 
             r.userId === userId && 
             r.reactionType === request.reactionType
      );

      if (existingReaction) {
        return {
          reaction: existingReaction,
          success: true,
          message: 'Reaction already exists'
        };
      }

      const reaction: PropertyReaction = {
        id: `reaction-${this.nextId++}`,
        propertyId: request.propertyId,
        userId,
        reactionType: request.reactionType,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.reactions.push(reaction);

      // Create activity
      await this.createActivity({
        propertyId: request.propertyId,
        userId,
        activityType: SocialActivityType.REACTED,
        content: `Reacted with ${request.reactionType}`,
        metadata: { reactionId: reaction.id },
        isPublic: true
      });

      return {
        reaction,
        success: true,
        message: 'Reaction created successfully'
      };
    } catch (error) {
      return {
        reaction: null as any,
        success: false,
        message: 'Failed to create reaction'
      };
    }
  }

  /**
   * Remove a property reaction
   */
  async removeReaction(propertyId: string, reactionType: ReactionType, userId: string): Promise<ReactionResponse> {
    try {
      const reactionIndex = this.reactions.findIndex(
        r => r.propertyId === propertyId && 
             r.userId === userId && 
             r.reactionType === reactionType
      );

      if (reactionIndex === -1) {
        return {
          reaction: null as any,
          success: false,
          message: 'Reaction not found'
        };
      }

      const reaction = this.reactions[reactionIndex];
      this.reactions.splice(reactionIndex, 1);

      return {
        reaction,
        success: true,
        message: 'Reaction removed successfully'
      };
    } catch (error) {
      return {
        reaction: null as any,
        success: false,
        message: 'Failed to remove reaction'
      };
    }
  }

  /**
   * Create a property comment
   */
  async createComment(request: CreateCommentRequest, userId: string): Promise<CommentResponse> {
    try {
      const comment: PropertyComment = {
        id: `comment-${this.nextId++}`,
        propertyId: request.propertyId,
        userId,
        parentId: request.parentId,
        content: request.content,
        isPublic: request.isPublic || true,
        isEdited: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        reactions: [],
        replies: [],
        metadata: {
          likeCount: 0,
          dislikeCount: 0,
          replyCount: 0,
          isPinned: false,
          isReported: false,
          moderationStatus: ModerationStatus.PENDING
        }
      };

      this.comments.push(comment);

      // Create activity
      await this.createActivity({
        propertyId: request.propertyId,
        userId,
        activityType: SocialActivityType.COMMENTED,
        content: `Commented: ${request.content.substring(0, 50)}...`,
        metadata: { commentId: comment.id },
        isPublic: request.isPublic || true
      });

      return {
        comment,
        success: true,
        message: 'Comment created successfully'
      };
    } catch (error) {
      return {
        comment: null as any,
        success: false,
        message: 'Failed to create comment'
      };
    }
  }

  /**
   * Update a property comment
   */
  async updateComment(id: string, request: UpdateCommentRequest, userId: string): Promise<CommentResponse> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id && c.userId === userId);
      
      if (commentIndex === -1) {
        return {
          comment: null as any,
          success: false,
          message: 'Comment not found'
        };
      }

      const comment = this.comments[commentIndex];
      comment.content = request.content;
      comment.isEdited = true;
      comment.editedAt = new Date();
      comment.updatedAt = new Date();
      
      if (request.isPublic !== undefined) {
        comment.isPublic = request.isPublic;
      }

      this.comments[commentIndex] = comment;

      return {
        comment,
        success: true,
        message: 'Comment updated successfully'
      };
    } catch (error) {
      return {
        comment: null as any,
        success: false,
        message: 'Failed to update comment'
      };
    }
  }

  /**
   * Delete a property comment
   */
  async deleteComment(id: string, userId: string): Promise<CommentResponse> {
    try {
      const commentIndex = this.comments.findIndex(c => c.id === id && c.userId === userId);
      
      if (commentIndex === -1) {
        return {
          comment: null as any,
          success: false,
          message: 'Comment not found'
        };
      }

      const comment = this.comments[commentIndex];
      this.comments.splice(commentIndex, 1);

      return {
        comment,
        success: true,
        message: 'Comment deleted successfully'
      };
    } catch (error) {
      return {
        comment: null as any,
        success: false,
        message: 'Failed to delete comment'
      };
    }
  }

  /**
   * Create a property follow
   */
  async createFollow(request: CreateFollowRequest, userId: string): Promise<FollowResponse> {
    try {
      // Check if user already follows
      const existingFollow = this.follows.find(
        f => f.propertyId === request.propertyId && f.userId === userId
      );

      if (existingFollow) {
        return {
          follow: existingFollow,
          success: true,
          message: 'Already following this property'
        };
      }

      const follow: PropertyFollow = {
        id: `follow-${this.nextId++}`,
        propertyId: request.propertyId,
        userId,
        followType: request.followType,
        notifications: {
          priceChanges: true,
          statusChanges: true,
          newComments: false,
          newReactions: false,
          newShares: true,
          marketUpdates: true,
          weeklyDigest: false,
          ...request.notifications
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.follows.push(follow);

      // Create activity
      await this.createActivity({
        propertyId: request.propertyId,
        userId,
        activityType: SocialActivityType.FOLLOWED,
        content: `Started following this property`,
        metadata: { followId: follow.id },
        isPublic: true
      });

      return {
        follow,
        success: true,
        message: 'Follow created successfully'
      };
    } catch (error) {
      return {
        follow: null as any,
        success: false,
        message: 'Failed to create follow'
      };
    }
  }

  /**
   * Update a property follow
   */
  async updateFollow(id: string, request: UpdateFollowRequest, userId: string): Promise<FollowResponse> {
    try {
      const followIndex = this.follows.findIndex(f => f.id === id && f.userId === userId);
      
      if (followIndex === -1) {
        return {
          follow: null as any,
          success: false,
          message: 'Follow not found'
        };
      }

      const follow = this.follows[followIndex];
      
      if (request.notifications) {
        follow.notifications = { ...follow.notifications, ...request.notifications };
      }
      
      follow.updatedAt = new Date();
      this.follows[followIndex] = follow;

      return {
        follow,
        success: true,
        message: 'Follow updated successfully'
      };
    } catch (error) {
      return {
        follow: null as any,
        success: false,
        message: 'Failed to update follow'
      };
    }
  }

  /**
   * Delete a property follow
   */
  async deleteFollow(id: string, userId: string): Promise<FollowResponse> {
    try {
      const followIndex = this.follows.findIndex(f => f.id === id && f.userId === userId);
      
      if (followIndex === -1) {
        return {
          follow: null as any,
          success: false,
          message: 'Follow not found'
        };
      }

      const follow = this.follows[followIndex];
      this.follows.splice(followIndex, 1);

      // Create activity
      await this.createActivity({
        propertyId: follow.propertyId,
        userId,
        activityType: SocialActivityType.UNFOLLOWED,
        content: `Stopped following this property`,
        metadata: { followId: follow.id },
        isPublic: true
      });

      return {
        follow,
        success: true,
        message: 'Follow deleted successfully'
      };
    } catch (error) {
      return {
        follow: null as any,
        success: false,
        message: 'Failed to delete follow'
      };
    }
  }

  /**
   * Get property social data
   */
  async getPropertySocialData(propertyId: string): Promise<PropertySocialDataResponse> {
    try {
      const propertyShares = this.shares.filter(s => s.propertyId === propertyId);
      const propertyReactions = this.reactions.filter(r => r.propertyId === propertyId);
      const propertyComments = this.comments.filter(c => c.propertyId === propertyId);
      const propertyFollows = this.follows.filter(f => f.propertyId === propertyId);
      const propertyActivities = this.activities.filter(a => a.propertyId === propertyId);

      const stats = this.calculatePropertySocialStats(propertyId);
      const trending = this.calculateTrendingData(propertyId);

      const socialData: PropertySocialData = {
        propertyId,
        shares: propertyShares,
        reactions: propertyReactions,
        comments: propertyComments,
        follows: propertyFollows,
        activities: propertyActivities,
        stats,
        trending
      };

      return {
        data: socialData,
        success: true
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: 'Failed to get property social data'
      };
    }
  }

  /**
   * Create social profile
   */
  async createSocialProfile(request: CreateSocialProfileRequest, userId: string): Promise<SocialProfileResponse> {
    try {
      const profile: SocialProfile = {
        id: `profile-${this.nextId++}`,
        userId,
        displayName: request.displayName,
        bio: request.bio,
        avatar: request.avatar,
        coverImage: request.coverImage,
        location: request.location,
        website: request.website,
        socialLinks: {
          twitter: '',
          linkedin: '',
          facebook: '',
          instagram: '',
          website: '',
          ...request.socialLinks
        },
        preferences: {
          showActivity: true,
          showFavorites: true,
          showWishlists: false,
          allowDirectMessages: true,
          allowPropertyShares: true,
          allowComments: true,
          allowReactions: true,
          privacyLevel: PrivacyLevel.PUBLIC,
          ...request.preferences
        },
        stats: {
          propertiesShared: 0,
          propertiesFavorited: 0,
          commentsPosted: 0,
          reactionsGiven: 0,
          followersCount: 0,
          followingCount: 0,
          totalViews: 0,
          totalShares: 0
        },
        isVerified: false,
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.profiles.push(profile);

      return {
        profile,
        success: true,
        message: 'Social profile created successfully'
      };
    } catch (error) {
      return {
        profile: null as any,
        success: false,
        message: 'Failed to create social profile'
      };
    }
  }

  /**
   * Update social profile
   */
  async updateSocialProfile(userId: string, request: UpdateSocialProfileRequest): Promise<SocialProfileResponse> {
    try {
      const profileIndex = this.profiles.findIndex(p => p.userId === userId);
      
      if (profileIndex === -1) {
        return {
          profile: null as any,
          success: false,
          message: 'Social profile not found'
        };
      }

      const profile = this.profiles[profileIndex];
      
      if (request.displayName !== undefined) profile.displayName = request.displayName;
      if (request.bio !== undefined) profile.bio = request.bio;
      if (request.avatar !== undefined) profile.avatar = request.avatar;
      if (request.coverImage !== undefined) profile.coverImage = request.coverImage;
      if (request.location !== undefined) profile.location = request.location;
      if (request.website !== undefined) profile.website = request.website;
      if (request.socialLinks !== undefined) {
        profile.socialLinks = { ...profile.socialLinks, ...request.socialLinks };
      }
      if (request.preferences !== undefined) {
        profile.preferences = { ...profile.preferences, ...request.preferences };
      }
      
      profile.updatedAt = new Date();
      this.profiles[profileIndex] = profile;

      return {
        profile,
        success: true,
        message: 'Social profile updated successfully'
      };
    } catch (error) {
      return {
        profile: null as any,
        success: false,
        message: 'Failed to update social profile'
      };
    }
  }

  /**
   * Get social profile
   */
  async getSocialProfile(userId: string): Promise<SocialProfileResponse> {
    try {
      const profile = this.profiles.find(p => p.userId === userId);
      
      if (!profile) {
        return {
          profile: null as any,
          success: false,
          message: 'Social profile not found'
        };
      }

      return {
        profile,
        success: true
      };
    } catch (error) {
      return {
        profile: null as any,
        success: false,
        message: 'Failed to get social profile'
      };
    }
  }

  /**
   * Search social activities
   */
  async searchActivities(query: SocialSearchQuery, page = 1, limit = 20): Promise<SocialSearchResponse> {
    try {
      let filteredActivities = this.activities;

      // Apply filters
      if (query.propertyId) {
        filteredActivities = filteredActivities.filter(a => a.propertyId === query.propertyId);
      }

      if (query.userId) {
        filteredActivities = filteredActivities.filter(a => a.userId === query.userId);
      }

      if (query.activityType && query.activityType.length > 0) {
        filteredActivities = filteredActivities.filter(a => query.activityType!.includes(a.activityType));
      }

      if (query.dateRange) {
        filteredActivities = filteredActivities.filter(a => {
          const activityDate = new Date(a.createdAt);
          return activityDate >= query.dateRange!.start && activityDate <= query.dateRange!.end;
        });
      }

      if (query.keywords) {
        const keywords = query.keywords.toLowerCase();
        filteredActivities = filteredActivities.filter(a => 
          a.content?.toLowerCase().includes(keywords)
        );
      }

      if (query.isPublic !== undefined) {
        filteredActivities = filteredActivities.filter(a => a.isPublic === query.isPublic);
      }

      // Sort by date
      filteredActivities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

      // Generate facets
      const facets = {
        activityTypes: this.generateFacet(filteredActivities, 'activityType'),
        users: this.generateFacet(filteredActivities, 'userId'),
        dateRanges: this.generateDateRangeFacet(filteredActivities)
      };

      return {
        activities: paginatedActivities,
        total: filteredActivities.length,
        page,
        limit,
        facets
      };
    } catch (error) {
      return {
        activities: [],
        total: 0,
        page,
        limit,
        facets: {
          activityTypes: {},
          users: {},
          dateRanges: {}
        }
      };
    }
  }

  /**
   * Get social analytics
   */
  async getSocialAnalytics(propertyId: string, period: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<SocialAnalytics | null> {
    try {
      const propertyActivities = this.activities.filter(a => a.propertyId === propertyId);
      const propertyShares = this.shares.filter(s => s.propertyId === propertyId);
      const propertyReactions = this.reactions.filter(r => r.propertyId === propertyId);
      const propertyComments = this.comments.filter(c => c.propertyId === propertyId);
      const propertyFollows = this.follows.filter(f => f.propertyId === propertyId);

      const totalShares = propertyShares.length;
      const totalReactions = propertyReactions.length;
      const totalComments = propertyComments.length;
      const totalViews = propertyShares.reduce((sum, share) => sum + share.metadata.viewCount, 0);
      const totalFollows = propertyFollows.length;

      const engagementRate = totalViews > 0 ? ((totalReactions + totalComments) / totalViews) * 100 : 0;
      const shareRate = totalViews > 0 ? (totalShares / totalViews) * 100 : 0;
      const reactionRate = totalViews > 0 ? (totalReactions / totalViews) * 100 : 0;
      const commentRate = totalViews > 0 ? (totalComments / totalViews) * 100 : 0;

      const topReactions = this.generateFacet(propertyReactions, 'reactionType');
      const topCommenters = this.generateFacet(propertyComments, 'userId');
      const topSharers = this.generateFacet(propertyShares, 'sharedBy');

      const activityTrend = this.generateActivityTrend(propertyActivities, period);

      const insights = this.generateSocialInsights({
        totalShares,
        totalReactions,
        totalComments,
        totalViews,
        totalFollows,
        engagementRate
      });

      return {
        propertyId,
        period,
        totalShares,
        totalReactions,
        totalComments,
        totalViews,
        totalFollows,
        engagementRate,
        shareRate,
        reactionRate,
        commentRate,
        topReactions,
        topCommenters: Object.entries(topCommenters).map(([userId, count]) => ({
          userId,
          count,
          name: this.getUserName(userId)
        })),
        topSharers: Object.entries(topSharers).map(([userId, count]) => ({
          userId,
          count,
          name: this.getUserName(userId)
        })),
        activityTrend,
        demographicData: {
          ageGroups: { '25-34': 45, '35-44': 30, '45-54': 20, '55+': 5 },
          locations: { 'San Francisco': 40, 'Los Angeles': 25, 'New York': 20, 'Other': 15 },
          devices: { 'Mobile': 60, 'Desktop': 30, 'Tablet': 10 }
        },
        insights
      };
    } catch (error) {
      return null;
    }
  }

  // Private helper methods
  private async createActivity(activityData: Partial<SocialActivity>): Promise<void> {
    const activity: SocialActivity = {
      id: `activity-${this.nextId++}`,
      propertyId: activityData.propertyId!,
      userId: activityData.userId!,
      activityType: activityData.activityType!,
      targetUserId: activityData.targetUserId,
      content: activityData.content,
      metadata: activityData.metadata || {},
      isPublic: activityData.isPublic || true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.activities.push(activity);
  }

  private calculatePropertySocialStats(propertyId: string): any {
    const propertyShares = this.shares.filter(s => s.propertyId === propertyId);
    const propertyReactions = this.reactions.filter(r => r.propertyId === propertyId);
    const propertyComments = this.comments.filter(c => c.propertyId === propertyId);
    const propertyFollows = this.follows.filter(f => f.propertyId === propertyId);

    const totalViews = propertyShares.reduce((sum, share) => sum + share.metadata.viewCount, 0);
    const engagementRate = totalViews > 0 ? ((propertyReactions.length + propertyComments.length) / totalViews) * 100 : 0;

    return {
      totalShares: propertyShares.length,
      totalReactions: propertyReactions.length,
      totalComments: propertyComments.length,
      totalFollows: propertyFollows.length,
      totalViews,
      engagementRate,
      shareRate: totalViews > 0 ? (propertyShares.length / totalViews) * 100 : 0,
      reactionRate: totalViews > 0 ? (propertyReactions.length / totalViews) * 100 : 0,
      commentRate: totalViews > 0 ? (propertyComments.length / totalViews) * 100 : 0,
      topReactions: this.generateFacet(propertyReactions, 'reactionType'),
      topCommenters: Object.entries(this.generateFacet(propertyComments, 'userId')).map(([userId, count]) => ({
        userId,
        count
      })),
      topSharers: Object.entries(this.generateFacet(propertyShares, 'sharedBy')).map(([userId, count]) => ({
        userId,
        count
      })),
      activityTrend: this.generateActivityTrend(this.activities.filter(a => a.propertyId === propertyId), 'week')
    };
  }

  private calculateTrendingData(propertyId: string): any {
    const propertyActivities = this.activities.filter(a => a.propertyId === propertyId);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentActivities = propertyActivities.filter(a => new Date(a.createdAt) >= oneWeekAgo);
    const previousActivities = propertyActivities.filter(a => 
      new Date(a.createdAt) >= twoWeeksAgo && new Date(a.createdAt) < oneWeekAgo
    );

    const recentCount = recentActivities.length;
    const previousCount = previousActivities.length;
    const changePercentage = previousCount > 0 ? ((recentCount - previousCount) / previousCount) * 100 : 0;

    return {
      isTrending: recentCount > previousCount && changePercentage > 20,
      trendScore: Math.max(0, recentCount - previousCount),
      trendDirection: changePercentage > 5 ? 'up' : changePercentage < -5 ? 'down' : 'stable',
      trendPeriod: 'week',
      peakActivity: recentActivities.length > 0 ? 
        new Date(Math.max(...recentActivities.map(a => new Date(a.createdAt).getTime()))) : undefined,
      comparisonData: {
        previousPeriod: previousCount,
        changePercentage
      }
    };
  }

  private generateFacet(items: any[], field: string): { [key: string]: number } {
    const facet: { [key: string]: number } = {};
    
    items.forEach(item => {
      const value = item[field];
      if (value) {
        facet[value] = (facet[value] || 0) + 1;
      }
    });

    return facet;
  }

  private generateDateRangeFacet(activities: SocialActivity[]): { [key: string]: number } {
    const facet: { [key: string]: number } = {};
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const threeMonths = 90 * 24 * 60 * 60 * 1000;

    activities.forEach(activity => {
      const activityDate = new Date(activity.createdAt);
      const timeDiff = now.getTime() - activityDate.getTime();

      if (timeDiff <= oneWeek) {
        facet['Last Week'] = (facet['Last Week'] || 0) + 1;
      } else if (timeDiff <= oneMonth) {
        facet['Last Month'] = (facet['Last Month'] || 0) + 1;
      } else if (timeDiff <= threeMonths) {
        facet['Last 3 Months'] = (facet['Last 3 Months'] || 0) + 1;
      } else {
        facet['Older'] = (facet['Older'] || 0) + 1;
      }
    });

    return facet;
  }

  private generateActivityTrend(activities: SocialActivity[], period: string): any[] {
    const trend: { [key: string]: any } = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.createdAt).toISOString().split('T')[0];
      if (!trend[date]) {
        trend[date] = {
          date: new Date(date),
          shares: 0,
          reactions: 0,
          comments: 0,
          views: 0,
          follows: 0
        };
      }

      switch (activity.activityType) {
        case SocialActivityType.SHARED:
          trend[date].shares++;
          break;
        case SocialActivityType.REACTED:
          trend[date].reactions++;
          break;
        case SocialActivityType.COMMENTED:
          trend[date].comments++;
          break;
        case SocialActivityType.FOLLOWED:
          trend[date].follows++;
          break;
        case SocialActivityType.VIEWED:
          trend[date].views++;
          break;
      }
    });

    return Object.values(trend).sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
  }

  private generateSocialInsights(stats: any): string[] {
    const insights: string[] = [];
    
    if (stats.engagementRate > 10) {
      insights.push('High engagement rate indicates strong user interest in this property.');
    }
    
    if (stats.totalShares > 5) {
      insights.push('Multiple shares suggest this property has viral potential.');
    }
    
    if (stats.totalComments > 10) {
      insights.push('High comment activity indicates active community discussion.');
    }
    
    if (stats.totalFollows > 20) {
      insights.push('Strong following suggests this property is highly desirable.');
    }

    return insights;
  }

  private getUserName(userId: string): string {
    const profile = this.profiles.find(p => p.userId === userId);
    return profile?.displayName || `User ${userId}`;
  }
}

// Export singleton instance
export const socialService = new SocialService();
export default socialService;
