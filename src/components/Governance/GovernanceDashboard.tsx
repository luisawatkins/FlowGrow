'use client';

import React, { useState, useEffect } from 'react';
import { useGovernance } from '@/hooks/useGovernance';
import { Proposal, ProposalStatus, ProposalType, VoteType } from '@/types/governance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Vote, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';

interface GovernanceDashboardProps {
  userAddress?: string;
}

export const GovernanceDashboard: React.FC<GovernanceDashboardProps> = ({ userAddress }) => {
  const {
    proposals,
    activeProposals,
    stakeholderProfile,
    stats,
    analytics,
    emergencyMode,
    loading,
    error,
    notifications,
    createProposal,
    castVote,
    executeProposal,
    registerStakeholder,
    isStakeholder,
    canVote
  } = useGovernance(userAddress);

  const [selectedTab, setSelectedTab] = useState('overview');
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if user is stakeholder
  const [isUserStakeholder, setIsUserStakeholder] = useState(false);
  const [userCanVote, setUserCanVote] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (userAddress) {
      isStakeholder(userAddress).then(setIsUserStakeholder);
      
      // Check voting eligibility for each active proposal
      activeProposals.forEach(async (proposal) => {
        const canVoteResult = await canVote(userAddress, proposal.id);
        setUserCanVote(prev => ({ ...prev, [proposal.id]: canVoteResult }));
      });
    }
  }, [userAddress, activeProposals, isStakeholder, canVote]);

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Active:
        return 'bg-blue-100 text-blue-800';
      case ProposalStatus.Passed:
        return 'bg-green-100 text-green-800';
      case ProposalStatus.Rejected:
        return 'bg-red-100 text-red-800';
      case ProposalStatus.Executed:
        return 'bg-purple-100 text-purple-800';
      case ProposalStatus.Cancelled:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProposalTypeColor = (type: ProposalType) => {
    switch (type) {
      case ProposalType.PropertyRule:
        return 'bg-blue-100 text-blue-800';
      case ProposalType.FeeChange:
        return 'bg-yellow-100 text-yellow-800';
      case ProposalType.ContractUpgrade:
        return 'bg-purple-100 text-purple-800';
      case ProposalType.CommunityFund:
        return 'bg-green-100 text-green-800';
      case ProposalType.EmergencyAction:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Ended';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleVote = async (proposalId: number, voteType: VoteType) => {
    try {
      await castVote(proposalId, voteType);
      // Refresh data will be handled by the hook
    } catch (error) {
      console.error('Error casting vote:', error);
    }
  };

  const handleExecuteProposal = async (proposalId: number) => {
    try {
      await executeProposal(proposalId);
      // Refresh data will be handled by the hook
    } catch (error) {
      console.error('Error executing proposal:', error);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Governance Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Participate in decentralized decision making for the FlowGrow platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
            {isUserStakeholder && (
              <Button onClick={() => setShowCreateProposal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Proposal
              </Button>
            )}
          </div>
        </div>

        {/* Emergency Mode Alert */}
        {emergencyMode?.isActive && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-red-800 font-semibold">Emergency Mode Active</h3>
                <p className="text-red-700 text-sm">
                  Emergency mode has been activated for proposal #{emergencyMode.proposalID}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Stakeholders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStakeholders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Vote className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Proposals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeProposals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Participation Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.participationRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Voting Power</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalVotingPower.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Recent Proposals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Proposals</CardTitle>
                <CardDescription>
                  Latest governance proposals and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proposals.slice(0, 5).map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{proposal.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {proposal.description}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Badge className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                          <Badge className={getProposalTypeColor(proposal.proposalType)}>
                            {proposal.proposalType}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Proposal #{proposal.id}</span>
                        <span>
                          {proposal.status === ProposalStatus.Active ? (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTimeRemaining(proposal.votingEndTime)}
                            </span>
                          ) : (
                            new Date(proposal.createdAt).toLocaleDateString()
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stakeholder Status */}
            {userAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Stakeholder Status</CardTitle>
                  <CardDescription>
                    Your participation in governance and voting power
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stakeholderProfile ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {stakeholderProfile.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Voting Power:</span>
                        <span className="font-semibold">{stakeholderProfile.votingPower.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Properties Owned:</span>
                        <span className="font-semibold">{stakeholderProfile.propertyCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Property Value:</span>
                        <span className="font-semibold">
                          {stakeholderProfile.totalPropertyValue.toLocaleString()} FLOW
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You are not registered as a stakeholder</p>
                      <Button onClick={() => registerStakeholder({})}>
                        Register as Stakeholder
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Proposals</CardTitle>
                <CardDescription>
                  Complete list of governance proposals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {proposal.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{proposal.description}</p>
                          <div className="flex gap-2 mb-4">
                            <Badge className={getStatusColor(proposal.status)}>
                              {proposal.status}
                            </Badge>
                            <Badge className={getProposalTypeColor(proposal.proposalType)}>
                              {proposal.proposalType}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Voting Results */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {proposal.yesVotes.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Yes Votes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {proposal.noVotes.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">No Votes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">
                            {proposal.abstainVotes.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Abstain</div>
                        </div>
                      </div>

                      {/* Voting Actions */}
                      {proposal.status === ProposalStatus.Active && userCanVote[proposal.id] && (
                        <div className="flex gap-2 mb-4">
                          <Button
                            size="sm"
                            onClick={() => handleVote(proposal.id, VoteType.Yes)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Vote Yes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVote(proposal.id, VoteType.No)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Vote No
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVote(proposal.id, VoteType.Abstain)}
                          >
                            Abstain
                          </Button>
                        </div>
                      )}

                      {/* Execution Button */}
                      {proposal.status === ProposalStatus.Passed && isUserStakeholder && (
                        <Button
                          onClick={() => handleExecuteProposal(proposal.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Execute Proposal
                        </Button>
                      )}

                      <div className="text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>Proposal #{proposal.id}</span>
                          <span>
                            {proposal.status === ProposalStatus.Active ? (
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatTimeRemaining(proposal.votingEndTime)}
                              </span>
                            ) : (
                              new Date(proposal.createdAt).toLocaleDateString()
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stakeholder Community</CardTitle>
                <CardDescription>
                  Active stakeholders and their voting power
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Stakeholder details will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Governance Analytics</CardTitle>
                <CardDescription>
                  Insights and trends in governance participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Analytics charts and insights will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700 text-sm">{error.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
