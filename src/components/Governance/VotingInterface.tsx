'use client';

import React, { useState, useEffect } from 'react';
import { Proposal, VoteType, VotingResults } from '@/types/governance';
import { useGovernance } from '@/hooks/useGovernance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Minus, 
  Clock, 
  Users, 
  TrendingUp,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

interface VotingInterfaceProps {
  proposal: Proposal;
  userAddress?: string;
  onVoteCast?: (proposalId: number, voteType: VoteType) => void;
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({ 
  proposal, 
  userAddress, 
  onVoteCast 
}) => {
  const { castVote, getVotingResults, canVote, calculateVotingPower } = useGovernance(userAddress);
  
  const [votingResults, setVotingResults] = useState<VotingResults | null>(null);
  const [userVotingPower, setUserVotingPower] = useState<number>(0);
  const [canUserVote, setCanUserVote] = useState<boolean>(false);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  useEffect(() => {
    const loadVotingData = async () => {
      if (!userAddress) return;

      try {
        const [results, votingPower, canVoteResult] = await Promise.all([
          getVotingResults(proposal.id),
          calculateVotingPower(userAddress),
          canVote(userAddress, proposal.id)
        ]);

        setVotingResults(results);
        setUserVotingPower(votingPower);
        setCanUserVote(canVoteResult);
      } catch (error) {
        console.error('Error loading voting data:', error);
      }
    };

    loadVotingData();
  }, [proposal.id, userAddress, getVotingResults, calculateVotingPower, canVote]);

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Voting Ended';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours remaining`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes remaining`;
    return `${minutes} minutes remaining`;
  };

  const handleVote = async (voteType: VoteType) => {
    if (!canUserVote || isVoting) return;

    setIsVoting(true);
    setSelectedVote(voteType);

    try {
      const success = await castVote(proposal.id, voteType);
      
      if (success) {
        setHasVoted(true);
        onVoteCast?.(proposal.id, voteType);
        
        // Refresh voting results
        const updatedResults = await getVotingResults(proposal.id);
        setVotingResults(updatedResults);
      }
    } catch (error) {
      console.error('Error casting vote:', error);
    } finally {
      setIsVoting(false);
      setSelectedVote(null);
    }
  };

  const getVotePercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return (votes / total) * 100;
  };

  const getQuorumProgress = () => {
    if (!votingResults) return 0;
    const required = (proposal.totalVotingPower * proposal.quorumRequired) / 100;
    return Math.min((votingResults.totalVotes / required) * 100, 100);
  };

  const isVotingActive = proposal.status === 'Active' && Date.now() <= proposal.votingEndTime;
  const isVotingEnded = Date.now() > proposal.votingEndTime;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{proposal.title}</CardTitle>
            <CardDescription className="mt-2">
              {proposal.description}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              #{proposal.id}
            </Badge>
            <Badge 
              variant={isVotingActive ? "default" : "secondary"}
              className={isVotingActive ? "bg-blue-100 text-blue-800" : ""}
            >
              {isVotingActive ? "Active" : isVotingEnded ? "Ended" : proposal.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Voting Timer */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {isVotingActive ? formatTimeRemaining(proposal.votingEndTime) : 'Voting Period Ended'}
            </span>
          </div>
          {userVotingPower > 0 && (
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Your Voting Power: {userVotingPower.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Quorum Progress */}
        {votingResults && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Quorum Progress</span>
              <span className="text-sm text-gray-600">
                {votingResults.totalVotes.toLocaleString()} / {((proposal.totalVotingPower * proposal.quorumRequired) / 100).toLocaleString()} 
                ({proposal.quorumRequired}% required)
              </span>
            </div>
            <Progress 
              value={getQuorumProgress()} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span className={votingResults.quorumMet ? "text-green-600 font-medium" : ""}>
                {votingResults.quorumMet ? "✓ Quorum Met" : "Quorum Not Met"}
              </span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Voting Results */}
        {votingResults && (
          <div className="space-y-4">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Voting Results</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Yes Votes */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {votingResults.yesVotes.toLocaleString()}
                </div>
                <div className="text-sm text-green-700">Yes Votes</div>
                <div className="text-xs text-green-600 mt-1">
                  {getVotePercentage(votingResults.yesVotes, votingResults.totalVotes).toFixed(1)}%
                </div>
                <Progress 
                  value={getVotePercentage(votingResults.yesVotes, votingResults.totalVotes)} 
                  className="h-1 mt-2 bg-green-200"
                />
              </div>

              {/* No Votes */}
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {votingResults.noVotes.toLocaleString()}
                </div>
                <div className="text-sm text-red-700">No Votes</div>
                <div className="text-xs text-red-600 mt-1">
                  {getVotePercentage(votingResults.noVotes, votingResults.totalVotes).toFixed(1)}%
                </div>
                <Progress 
                  value={getVotePercentage(votingResults.noVotes, votingResults.totalVotes)} 
                  className="h-1 mt-2 bg-red-200"
                />
              </div>

              {/* Abstain Votes */}
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {votingResults.abstainVotes.toLocaleString()}
                </div>
                <div className="text-sm text-gray-700">Abstain</div>
                <div className="text-xs text-gray-600 mt-1">
                  {getVotePercentage(votingResults.abstainVotes, votingResults.totalVotes).toFixed(1)}%
                </div>
                <Progress 
                  value={getVotePercentage(votingResults.abstainVotes, votingResults.totalVotes)} 
                  className="h-1 mt-2 bg-gray-200"
                />
              </div>
            </div>

            {/* Participation Stats */}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-700">Participation Rate</span>
              </div>
              <span className="text-sm font-bold text-blue-800">
                {votingResults.participationRate.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Voting Actions */}
        {isVotingActive && canUserVote && !hasVoted && (
          <div className="space-y-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-700">
                Cast your vote using your voting power of {userVotingPower.toLocaleString()}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleVote(VoteType.Yes)}
                disabled={isVoting}
                className={`h-16 bg-green-600 hover:bg-green-700 text-white ${
                  selectedVote === VoteType.Yes ? 'ring-2 ring-green-300' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Vote Yes</span>
                </div>
              </Button>

              <Button
                onClick={() => handleVote(VoteType.No)}
                disabled={isVoting}
                variant="outline"
                className={`h-16 border-red-300 text-red-600 hover:bg-red-50 ${
                  selectedVote === VoteType.No ? 'ring-2 ring-red-300' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <XCircle className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Vote No</span>
                </div>
              </Button>

              <Button
                onClick={() => handleVote(VoteType.Abstain)}
                disabled={isVoting}
                variant="outline"
                className={`h-16 border-gray-300 text-gray-600 hover:bg-gray-50 ${
                  selectedVote === VoteType.Abstain ? 'ring-2 ring-gray-300' : ''
                }`}
              >
                <div className="flex flex-col items-center">
                  <Minus className="h-6 w-6 mb-1" />
                  <span className="text-sm font-medium">Abstain</span>
                </div>
              </Button>
            </div>

            {isVoting && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Processing your vote...</p>
              </div>
            )}
          </div>
        )}

        {/* Voting Status Messages */}
        {!canUserVote && userAddress && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Cannot Vote</h3>
                <p className="text-yellow-700 text-sm">
                  You are not eligible to vote on this proposal. You may need to register as a stakeholder or own property tokens.
                </p>
              </div>
            </div>
          </div>
        )}

        {!userAddress && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-blue-800 font-semibold">Connect Wallet</h3>
                <p className="text-blue-700 text-sm">
                  Please connect your wallet to participate in voting.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasVoted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h3 className="text-green-800 font-semibold">Vote Cast Successfully</h3>
                <p className="text-green-700 text-sm">
                  Your vote has been recorded. Thank you for participating in governance.
                </p>
              </div>
            </div>
          </div>
        )}

        {isVotingEnded && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600 mr-2" />
              <div>
                <h3 className="text-gray-800 font-semibold">Voting Period Ended</h3>
                <p className="text-gray-700 text-sm">
                  The voting period for this proposal has ended. Results are final.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Details */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Proposal Type:</span>
              <span className="ml-2 text-gray-600">{proposal.proposalType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Quorum Required:</span>
              <span className="ml-2 text-gray-600">{proposal.quorumRequired}%</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Voting Power:</span>
              <span className="ml-2 text-gray-600">{proposal.totalVotingPower.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">
                {new Date(proposal.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
