// Forum Service
// Business logic for property community forums functionality

import {
  Forum,
  ForumCategory,
  ForumSettings,
  ForumStats,
  ForumContributor,
  ForumBadge,
  Discussion,
  ForumUser,
  ForumReply,
  ForumReaction,
  ForumAttachment,
  EditHistory,
  SocialLink,
  UserPreferences,
  UserStats,
  NotificationPreferences,
  PrivacyPreferences,
  DisplayPreferences,
  QuietHours,
  ForumModeration,
  ForumReport,
  ReportEvidence,
  ForumAnalytics,
  ForumMetrics,
  ForumTrends,
  ForumInsights,
  ForumRecommendations,
  TrendData,
  TopContent,
  TopUser,
  UserBehaviorInsights,
  ContentPerformanceInsights,
  CommunityHealthInsights,
  ContentRecommendation,
  UserRecommendation,
  ModerationRecommendation,
  FeatureRecommendation,
  DeviceUsage,
  ForumSearch,
  ForumSearchFilters,
  ForumSearchResult,
  ForumSearchSuggestion,
  ForumSearchMetadata,
  SearchHighlight,
  SearchResultMetadata,
  SuggestionMetadata,
  DateRange,
  ForumApiRequest,
  ForumApiOptions,
  ForumApiResponse,
  ForumApiError,
  Pagination,
  ForumType,
  ForumVisibility,
  ForumAccess,
  ModerationLevel,
  DiscussionType,
  DiscussionStatus,
  DiscussionPriority,
  ReplyStatus,
  ReactionType,
  AttachmentType,
  SocialPlatform,
  BadgeCategory,
  ProfileVisibility,
  Theme,
  NotificationFrequency,
  NotificationType,
  SortOrder,
  ModerationAction,
  ModerationTargetType,
  ReportTargetType,
  ReportReason,
  ReportStatus,
  ReportPriority,
  EvidenceType,
  AnalyticsPeriod,
  ContentType,
  TrendDirection,
  RecommendationType,
  UserRecommendationType,
  ModerationRecommendationType,
  Priority,
  Impact,
  Effort,
  SearchResultType,
  SuggestionType,
  ForumSortBy
} from '@/types/forums';

// Mock data for development and testing
const mockForums: Forum[] = [
  {
    id: 'forum1',
    name: 'San Francisco Real Estate',
    description: 'Discussion about real estate in San Francisco',
    category: {
      id: 'cat1',
      name: 'Property Discussion',
      description: 'General property discussions',
      order: 1,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    type: ForumType.PROPERTY,
    visibility: ForumVisibility.PUBLIC,
    access: ForumAccess.OPEN,
    settings: {
      allowAnonymous: false,
      requireApproval: false,
      allowImages: true,
      allowVideos: true,
      allowLinks: true,
      maxPostLength: 10000,
      maxImageSize: 10485760,
      maxVideoSize: 104857600,
      moderationLevel: ModerationLevel.MODERATE,
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
        frequency: NotificationFrequency.IMMEDIATE,
        types: [NotificationType.MENTION, NotificationType.REPLY],
        quietHours: {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00',
          timezone: 'UTC',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      },
      privacySettings: {
        profileVisibility: ProfileVisibility.PUBLIC,
        showEmail: false,
        showLocation: true,
        showJoinDate: true,
        showLastActive: true,
        allowDirectMessages: true,
        allowFriendRequests: true
      },
      contentSettings: {
        allowEditing: true,
        editTimeLimit: 3600,
        allowDeletion: true,
        deletionTimeLimit: 86400,
        requireModeration: false,
        autoArchive: true,
        archiveAfterDays: 365
      }
    },
    stats: {
      totalPosts: 1250,
      totalThreads: 89,
      totalMembers: 456,
      totalViews: 15600,
      activeMembers: 78,
      lastActivity: '2024-01-15T10:30:00Z',
      growthRate: 0.15,
      engagementRate: 0.68,
      topContributors: []
    },
    moderators: ['user1', 'user2'],
    members: ['user1', 'user2', 'user3'],
    tags: ['real-estate', 'san-francisco', 'property'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'user1'
  }
];

const mockDiscussions: Discussion[] = [
  {
    id: 'discussion1',
    forumId: 'forum1',
    title: 'Best neighborhoods in SF for first-time buyers',
    content: 'I\'m looking to buy my first home in San Francisco. What are the best neighborhoods for first-time buyers?',
    author: {
      id: 'user1',
      username: 'john_doe',
      displayName: 'John Doe',
      avatar: '/avatars/user1.jpg',
      email: 'john@example.com',
      bio: 'First-time home buyer',
      location: 'San Francisco, CA',
      website: 'https://johndoe.com',
      socialLinks: [],
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          frequency: NotificationFrequency.IMMEDIATE,
          types: [NotificationType.MENTION, NotificationType.REPLY],
          quietHours: {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00',
            timezone: 'UTC',
            days: []
          }
        },
        privacy: {
          profileVisibility: ProfileVisibility.PUBLIC,
          showEmail: false,
          showLocation: true,
          showJoinDate: true,
          showLastActive: true,
          allowDirectMessages: true,
          allowFriendRequests: true
        },
        display: {
          postsPerPage: 20,
          threadsPerPage: 10,
          sortOrder: SortOrder.DESC,
          showAvatars: true,
          showSignatures: true,
          showTimestamps: true,
          compactMode: false
        },
        language: 'en',
        timezone: 'UTC',
        theme: Theme.LIGHT
      },
      stats: {
        totalPosts: 45,
        totalReplies: 120,
        totalViews: 890,
        totalReactions: 156,
        reputation: 1250,
        joinDate: '2024-01-01T00:00:00Z',
        lastActive: '2024-01-15T10:30:00Z',
        streak: 5,
        level: 3,
        experience: 2500
      },
      reputation: 1250,
      badges: [],
      isVerified: false,
      isModerator: false,
      isAdmin: false,
      joinDate: '2024-01-01T00:00:00Z',
      lastActive: '2024-01-15T10:30:00Z'
    },
    type: DiscussionType.QUESTION,
    status: DiscussionStatus.ACTIVE,
    priority: DiscussionPriority.NORMAL,
    tags: ['first-time-buyer', 'neighborhoods', 'san-francisco'],
    attachments: [],
    reactions: [
      {
        id: 'reaction1',
        type: ReactionType.LIKE,
        userId: 'user2',
        username: 'jane_smith',
        createdAt: '2024-01-15T10:30:00Z'
      }
    ],
    views: 45,
    replies: 3,
    lastReply: {
      id: 'reply1',
      discussionId: 'discussion1',
      content: 'I recommend looking at the Mission District or Castro. Both have great amenities and are more affordable.',
      author: {
        id: 'user2',
        username: 'jane_smith',
        displayName: 'Jane Smith',
        avatar: '/avatars/user2.jpg',
        email: 'jane@example.com',
        bio: 'Real estate agent',
        location: 'San Francisco, CA',
        website: 'https://janesmith.com',
        socialLinks: [],
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            frequency: NotificationFrequency.IMMEDIATE,
            types: [NotificationType.MENTION, NotificationType.REPLY],
            quietHours: {
              enabled: false,
              startTime: '22:00',
              endTime: '08:00',
              timezone: 'UTC',
              days: []
            }
          },
          privacy: {
            profileVisibility: ProfileVisibility.PUBLIC,
            showEmail: false,
            showLocation: true,
            showJoinDate: true,
            showLastActive: true,
            allowDirectMessages: true,
            allowFriendRequests: true
          },
          display: {
            postsPerPage: 20,
            threadsPerPage: 10,
            sortOrder: SortOrder.DESC,
            showAvatars: true,
            showSignatures: true,
            showTimestamps: true,
            compactMode: false
          },
          language: 'en',
          timezone: 'UTC',
          theme: Theme.LIGHT
        },
        stats: {
          totalPosts: 89,
          totalReplies: 234,
          totalViews: 1200,
          totalReactions: 456,
          reputation: 2500,
          joinDate: '2024-01-01T00:00:00Z',
          lastActive: '2024-01-15T10:30:00Z',
          streak: 12,
          level: 5,
          experience: 5000
        },
        reputation: 2500,
        badges: [],
        isVerified: true,
        isModerator: false,
        isAdmin: false,
        joinDate: '2024-01-01T00:00:00Z',
        lastActive: '2024-01-15T10:30:00Z'
      },
      status: ReplyStatus.ACTIVE,
      reactions: [],
      attachments: [],
      isSolution: false,
      isPinned: false,
      isEdited: false,
      editHistory: [],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    isPinned: false,
    isLocked: false,
    isArchived: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-15T10:30:00Z'
  }
];

class ForumService {
  private forums: Forum[] = mockForums;
  private discussions: Discussion[] = mockDiscussions;
  private replies: ForumReply[] = [];
  private moderations: ForumModeration[] = [];
  private reports: ForumReport[] = [];
  private analytics: ForumAnalytics[] = [];

  // Forum Management
  async getForums(request: ForumApiRequest): Promise<ForumApiResponse> {
    try {
      let filteredForums = [...this.forums];

      if (request.filters) {
        filteredForums = this.applyFilters(filteredForums, request.filters);
      }

      if (request.query) {
        filteredForums = this.applySearch(filteredForums, request.query);
      }

      const sortedForums = this.sortForums(filteredForums, request.options?.sortBy, request.options?.sortOrder);
      const paginatedForums = this.paginateResults(sortedForums, request.options?.page, request.options?.limit);

      return {
        success: true,
        data: paginatedForums.results,
        pagination: paginatedForums.pagination
      };
    } catch (error) {
      throw this.createApiError('FORUMS_FETCH_FAILED', 'Failed to fetch forums', error);
    }
  }

  async getForum(forumId: string): Promise<Forum> {
    try {
      const forum = this.forums.find(f => f.id === forumId);
      if (!forum) {
        throw this.createApiError('FORUM_NOT_FOUND', 'Forum not found', { forumId });
      }
      return forum;
    } catch (error) {
      throw this.createApiError('FORUM_FETCH_FAILED', 'Failed to fetch forum', error);
    }
  }

  async createForum(forum: Omit<Forum, 'id' | 'createdAt' | 'updatedAt'>): Promise<Forum> {
    try {
      const newForum: Forum = {
        ...forum,
        id: `forum_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.forums.push(newForum);
      return newForum;
    } catch (error) {
      throw this.createApiError('FORUM_CREATION_FAILED', 'Failed to create forum', error);
    }
  }

  async updateForum(forumId: string, updates: Partial<Forum>): Promise<Forum> {
    try {
      const index = this.forums.findIndex(f => f.id === forumId);
      if (index === -1) {
        throw this.createApiError('FORUM_NOT_FOUND', 'Forum not found', { forumId });
      }

      this.forums[index] = {
        ...this.forums[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.forums[index];
    } catch (error) {
      throw this.createApiError('FORUM_UPDATE_FAILED', 'Failed to update forum', error);
    }
  }

  async deleteForum(forumId: string): Promise<void> {
    try {
      const index = this.forums.findIndex(f => f.id === forumId);
      if (index === -1) {
        throw this.createApiError('FORUM_NOT_FOUND', 'Forum not found', { forumId });
      }

      this.forums.splice(index, 1);
    } catch (error) {
      throw this.createApiError('FORUM_DELETE_FAILED', 'Failed to delete forum', error);
    }
  }

  // Discussion Management
  async getDiscussions(forumId: string, request: ForumApiRequest): Promise<ForumApiResponse> {
    try {
      let filteredDiscussions = this.discussions.filter(d => d.forumId === forumId);

      if (request.filters) {
        filteredDiscussions = this.applyDiscussionFilters(filteredDiscussions, request.filters);
      }

      if (request.query) {
        filteredDiscussions = this.applyDiscussionSearch(filteredDiscussions, request.query);
      }

      const sortedDiscussions = this.sortDiscussions(filteredDiscussions, request.options?.sortBy, request.options?.sortOrder);
      const paginatedDiscussions = this.paginateResults(sortedDiscussions, request.options?.page, request.options?.limit);

      return {
        success: true,
        data: paginatedDiscussions.results,
        pagination: paginatedDiscussions.pagination
      };
    } catch (error) {
      throw this.createApiError('DISCUSSIONS_FETCH_FAILED', 'Failed to fetch discussions', error);
    }
  }

  async getDiscussion(discussionId: string): Promise<Discussion> {
    try {
      const discussion = this.discussions.find(d => d.id === discussionId);
      if (!discussion) {
        throw this.createApiError('DISCUSSION_NOT_FOUND', 'Discussion not found', { discussionId });
      }
      return discussion;
    } catch (error) {
      throw this.createApiError('DISCUSSION_FETCH_FAILED', 'Failed to fetch discussion', error);
    }
  }

  async createDiscussion(discussion: Omit<Discussion, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity'>): Promise<Discussion> {
    try {
      const newDiscussion: Discussion = {
        ...discussion,
        id: `discussion_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      this.discussions.push(newDiscussion);
      return newDiscussion;
    } catch (error) {
      throw this.createApiError('DISCUSSION_CREATION_FAILED', 'Failed to create discussion', error);
    }
  }

  async updateDiscussion(discussionId: string, updates: Partial<Discussion>): Promise<Discussion> {
    try {
      const index = this.discussions.findIndex(d => d.id === discussionId);
      if (index === -1) {
        throw this.createApiError('DISCUSSION_NOT_FOUND', 'Discussion not found', { discussionId });
      }

      this.discussions[index] = {
        ...this.discussions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      return this.discussions[index];
    } catch (error) {
      throw this.createApiError('DISCUSSION_UPDATE_FAILED', 'Failed to update discussion', error);
    }
  }

  async deleteDiscussion(discussionId: string): Promise<void> {
    try {
      const index = this.discussions.findIndex(d => d.id === discussionId);
      if (index === -1) {
        throw this.createApiError('DISCUSSION_NOT_FOUND', 'Discussion not found', { discussionId });
      }

      this.discussions.splice(index, 1);
    } catch (error) {
      throw this.createApiError('DISCUSSION_DELETE_FAILED', 'Failed to delete discussion', error);
    }
  }

  // Reply Management
  async getReplies(discussionId: string, request: ForumApiRequest): Promise<ForumApiResponse> {
    try {
      let filteredReplies = this.replies.filter(r => r.discussionId === discussionId);

      if (request.filters) {
        filteredReplies = this.applyReplyFilters(filteredReplies, request.filters);
      }

      if (request.query) {
        filteredReplies = this.applyReplySearch(filteredReplies, request.query);
      }

      const sortedReplies = this.sortReplies(filteredReplies, request.options?.sortBy, request.options?.sortOrder);
      const paginatedReplies = this.paginateResults(sortedReplies, request.options?.page, request.options?.limit);

      return {
        success: true,
        data: paginatedReplies.results,
        pagination: paginatedReplies.pagination
      };
    } catch (error) {
      throw this.createApiError('REPLIES_FETCH_FAILED', 'Failed to fetch replies', error);
    }
  }

  async createReply(reply: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt'>): Promise<ForumReply> {
    try {
      const newReply: ForumReply = {
        ...reply,
        id: `reply_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.replies.push(newReply);
      return newReply;
    } catch (error) {
      throw this.createApiError('REPLY_CREATION_FAILED', 'Failed to create reply', error);
    }
  }

  async updateReply(replyId: string, updates: Partial<ForumReply>): Promise<ForumReply> {
    try {
      const index = this.replies.findIndex(r => r.id === replyId);
      if (index === -1) {
        throw this.createApiError('REPLY_NOT_FOUND', 'Reply not found', { replyId });
      }

      this.replies[index] = {
        ...this.replies[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.replies[index];
    } catch (error) {
      throw this.createApiError('REPLY_UPDATE_FAILED', 'Failed to update reply', error);
    }
  }

  async deleteReply(replyId: string): Promise<void> {
    try {
      const index = this.replies.findIndex(r => r.id === replyId);
      if (index === -1) {
        throw this.createApiError('REPLY_NOT_FOUND', 'Reply not found', { replyId });
      }

      this.replies.splice(index, 1);
    } catch (error) {
      throw this.createApiError('REPLY_DELETE_FAILED', 'Failed to delete reply', error);
    }
  }

  // Moderation Management
  async getModerations(request: ForumApiRequest): Promise<ForumApiResponse> {
    try {
      let filteredModerations = [...this.moderations];

      if (request.filters) {
        filteredModerations = this.applyModerationFilters(filteredModerations, request.filters);
      }

      if (request.query) {
        filteredModerations = this.applyModerationSearch(filteredModerations, request.query);
      }

      const sortedModerations = this.sortModerations(filteredModerations, request.options?.sortBy, request.options?.sortOrder);
      const paginatedModerations = this.paginateResults(sortedModerations, request.options?.page, request.options?.limit);

      return {
        success: true,
        data: paginatedModerations.results,
        pagination: paginatedModerations.pagination
      };
    } catch (error) {
      throw this.createApiError('MODERATIONS_FETCH_FAILED', 'Failed to fetch moderations', error);
    }
  }

  async createModeration(moderation: Omit<ForumModeration, 'id' | 'createdAt'>): Promise<ForumModeration> {
    try {
      const newModeration: ForumModeration = {
        ...moderation,
        id: `moderation_${Date.now()}`,
        createdAt: new Date().toISOString()
      };

      this.moderations.push(newModeration);
      return newModeration;
    } catch (error) {
      throw this.createApiError('MODERATION_CREATION_FAILED', 'Failed to create moderation', error);
    }
  }

  async getReports(request: ForumApiRequest): Promise<ForumApiResponse> {
    try {
      let filteredReports = [...this.reports];

      if (request.filters) {
        filteredReports = this.applyReportFilters(filteredReports, request.filters);
      }

      if (request.query) {
        filteredReports = this.applyReportSearch(filteredReports, request.query);
      }

      const sortedReports = this.sortReports(filteredReports, request.options?.sortBy, request.options?.sortOrder);
      const paginatedReports = this.paginateResults(sortedReports, request.options?.page, request.options?.limit);

      return {
        success: true,
        data: paginatedReports.results,
        pagination: paginatedReports.pagination
      };
    } catch (error) {
      throw this.createApiError('REPORTS_FETCH_FAILED', 'Failed to fetch reports', error);
    }
  }

  async createReport(report: Omit<ForumReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<ForumReport> {
    try {
      const newReport: ForumReport = {
        ...report,
        id: `report_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.reports.push(newReport);
      return newReport;
    } catch (error) {
      throw this.createApiError('REPORT_CREATION_FAILED', 'Failed to create report', error);
    }
  }

  async updateReport(reportId: string, updates: Partial<ForumReport>): Promise<ForumReport> {
    try {
      const index = this.reports.findIndex(r => r.id === reportId);
      if (index === -1) {
        throw this.createApiError('REPORT_NOT_FOUND', 'Report not found', { reportId });
      }

      this.reports[index] = {
        ...this.reports[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return this.reports[index];
    } catch (error) {
      throw this.createApiError('REPORT_UPDATE_FAILED', 'Failed to update report', error);
    }
  }

  // Analytics
  async getAnalytics(forumId: string, period: AnalyticsPeriod): Promise<ForumAnalytics> {
    try {
      const analytics: ForumAnalytics = {
        forumId,
        period,
        metrics: {
          totalUsers: 456,
          activeUsers: 78,
          newUsers: 12,
          totalPosts: 1250,
          totalReplies: 3400,
          totalViews: 15600,
          engagementRate: 0.68,
          retentionRate: 0.85,
          growthRate: 0.15,
          topContent: [],
          topUsers: []
        },
        trends: {
          userGrowth: [],
          postGrowth: [],
          engagementTrend: [],
          activityTrend: [],
          sentimentTrend: []
        },
        insights: {
          peakActivity: ['10:00', '14:00', '19:00'],
          popularTopics: ['real-estate', 'investment', 'neighborhoods'],
          userBehavior: {
            averageSessionDuration: 15.5,
            bounceRate: 0.25,
            returnRate: 0.75,
            engagementScore: 0.68,
            preferredContentTypes: ['discussion', 'question', 'tip'],
            activeHours: ['10:00', '14:00', '19:00'],
            deviceUsage: []
          },
          contentPerformance: {
            averagePostLength: 250,
            averageReplyLength: 120,
            mostEngagingContent: ['neighborhood guides', 'investment tips'],
            leastEngagingContent: ['spam', 'off-topic'],
            contentGaps: ['commercial real estate', 'rental market'],
            trendingTopics: ['first-time buyers', 'market trends']
          },
          communityHealth: {
            toxicityLevel: 0.15,
            moderationEfficiency: 0.85,
            userSatisfaction: 0.78,
            conflictResolution: 0.90,
            communityGrowth: 0.15,
            engagementQuality: 0.72
          }
        },
        recommendations: {
          content: [],
          users: [],
          moderation: [],
          features: []
        },
        timestamp: new Date().toISOString()
      };

      return analytics;
    } catch (error) {
      throw this.createApiError('ANALYTICS_FETCH_FAILED', 'Failed to fetch analytics', error);
    }
  }

  // Search
  async search(request: ForumApiRequest): Promise<ForumSearch> {
    try {
      const query = request.query || '';
      const filters = request.filters || {};
      
      // Simulate search results
      const results: ForumSearchResult[] = [];
      const suggestions: ForumSearchSuggestion[] = [];
      
      const metadata: ForumSearchMetadata = {
        query,
        totalResults: results.length,
        processingTime: 150,
        filters,
        timestamp: new Date().toISOString()
      };

      return {
        query,
        filters,
        results,
        suggestions,
        metadata
      };
    } catch (error) {
      throw this.createApiError('SEARCH_FAILED', 'Failed to search forums', error);
    }
  }

  // Private helper methods
  private applyFilters(forums: Forum[], filters: any): Forum[] {
    return forums.filter(forum => {
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(forum.type)) return false;
      }

      if (filters.visibility && filters.visibility.length > 0) {
        if (!filters.visibility.includes(forum.visibility)) return false;
      }

      if (filters.access && filters.access.length > 0) {
        if (!filters.access.includes(forum.access)) return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some((tag: string) => forum.tags.includes(tag))) return false;
      }

      return true;
    });
  }

  private applySearch(forums: Forum[], query: string): Forum[] {
    const lowercaseQuery = query.toLowerCase();
    return forums.filter(forum =>
      forum.name.toLowerCase().includes(lowercaseQuery) ||
      forum.description.toLowerCase().includes(lowercaseQuery) ||
      forum.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  private applyDiscussionFilters(discussions: Discussion[], filters: any): Discussion[] {
    return discussions.filter(discussion => {
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(discussion.type)) return false;
      }

      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(discussion.status)) return false;
      }

      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(discussion.priority)) return false;
      }

      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some((tag: string) => discussion.tags.includes(tag))) return false;
      }

      return true;
    });
  }

  private applyDiscussionSearch(discussions: Discussion[], query: string): Discussion[] {
    const lowercaseQuery = query.toLowerCase();
    return discussions.filter(discussion =>
      discussion.title.toLowerCase().includes(lowercaseQuery) ||
      discussion.content.toLowerCase().includes(lowercaseQuery) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  private applyReplyFilters(replies: ForumReply[], filters: any): ForumReply[] {
    return replies.filter(reply => {
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(reply.status)) return false;
      }

      if (filters.isSolution !== undefined) {
        if (reply.isSolution !== filters.isSolution) return false;
      }

      if (filters.isPinned !== undefined) {
        if (reply.isPinned !== filters.isPinned) return false;
      }

      return true;
    });
  }

  private applyReplySearch(replies: ForumReply[], query: string): ForumReply[] {
    const lowercaseQuery = query.toLowerCase();
    return replies.filter(reply =>
      reply.content.toLowerCase().includes(lowercaseQuery)
    );
  }

  private applyModerationFilters(moderations: ForumModeration[], filters: any): ForumModeration[] {
    return moderations.filter(moderation => {
      if (filters.action && filters.action.length > 0) {
        if (!filters.action.includes(moderation.action)) return false;
      }

      if (filters.targetType && filters.targetType.length > 0) {
        if (!filters.targetType.includes(moderation.targetType)) return false;
      }

      if (filters.isActive !== undefined) {
        if (moderation.isActive !== filters.isActive) return false;
      }

      return true;
    });
  }

  private applyModerationSearch(moderations: ForumModeration[], query: string): ForumModeration[] {
    const lowercaseQuery = query.toLowerCase();
    return moderations.filter(moderation =>
      moderation.reason.toLowerCase().includes(lowercaseQuery) ||
      moderation.details?.toLowerCase().includes(lowercaseQuery)
    );
  }

  private applyReportFilters(reports: ForumReport[], filters: any): ForumReport[] {
    return reports.filter(report => {
      if (filters.reason && filters.reason.length > 0) {
        if (!filters.reason.includes(report.reason)) return false;
      }

      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(report.status)) return false;
      }

      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(report.priority)) return false;
      }

      return true;
    });
  }

  private applyReportSearch(reports: ForumReport[], query: string): ForumReport[] {
    const lowercaseQuery = query.toLowerCase();
    return reports.filter(report =>
      report.description.toLowerCase().includes(lowercaseQuery) ||
      report.reason.toLowerCase().includes(lowercaseQuery)
    );
  }

  private sortForums(forums: Forum[], sortBy?: string, sortOrder?: SortOrder): Forum[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return forums.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'members':
          comparison = a.members.length - b.members.length;
          break;
        case 'activity':
          comparison = new Date(a.stats.lastActivity).getTime() - new Date(b.stats.lastActivity).getTime();
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return comparison * order;
    });
  }

  private sortDiscussions(discussions: Discussion[], sortBy?: string, sortOrder?: SortOrder): Discussion[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return discussions.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'lastActivity':
          comparison = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
          break;
        case 'replies':
          comparison = a.replies - b.replies;
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return comparison * order;
    });
  }

  private sortReplies(replies: ForumReply[], sortBy?: string, sortOrder?: SortOrder): ForumReply[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return replies.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'reactions':
          comparison = a.reactions.length - b.reactions.length;
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return comparison * order;
    });
  }

  private sortModerations(moderations: ForumModeration[], sortBy?: string, sortOrder?: SortOrder): ForumModeration[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return moderations.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'action':
          comparison = a.action.localeCompare(b.action);
          break;
        case 'targetType':
          comparison = a.targetType.localeCompare(b.targetType);
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return comparison * order;
    });
  }

  private sortReports(reports: ForumReport[], sortBy?: string, sortOrder?: SortOrder): ForumReport[] {
    const order = sortOrder === SortOrder.DESC ? -1 : 1;
    
    return reports.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          comparison = a.priority.localeCompare(b.priority);
          break;
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return comparison * order;
    });
  }

  private paginateResults<T>(items: T[], page: number = 1, limit: number = 10): { results: T[], pagination: Pagination } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const results = items.slice(startIndex, endIndex);
    
    const pagination: Pagination = {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: endIndex < items.length,
      hasPrev: page > 1
    };

    return { results, pagination };
  }

  private createApiError(code: string, message: string, details?: any): ForumApiError {
    return {
      code,
      message,
      details,
      status: 500,
      timestamp: new Date().toISOString()
    };
  }
}

export const forumService = new ForumService();
