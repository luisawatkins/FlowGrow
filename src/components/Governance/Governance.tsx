'use client';

import React, { useState } from 'react';
import { GovernanceDashboard } from './GovernanceDashboard';
import { VotingInterface } from './VotingInterface';
import { ProposalCreation } from './ProposalCreation';
import { StakeholderManagement } from './StakeholderManagement';
import { Proposal, VoteType } from '@/types/governance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Vote, 
  Plus, 
  Users, 
  ArrowLeft,
  Settings
} from 'lucide-react';

interface GovernanceProps {
  userAddress?: string;
}

type ViewMode = 'dashboard' | 'voting' | 'create' | 'stakeholders' | 'settings';

export const Governance: React.FC<GovernanceProps> = ({ userAddress }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  const handleVoteCast = (proposalId: number, voteType: VoteType) => {
    console.log(`Vote cast: ${voteType} for proposal ${proposalId}`);
    // Handle vote cast event
  };

  const handleProposalCreated = (proposalId: number) => {
    console.log(`Proposal created: ${proposalId}`);
    setShowCreateProposal(false);
    setCurrentView('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProposal(null);
    setShowCreateProposal(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <GovernanceDashboard 
            userAddress={userAddress}
          />
        );
      
      case 'voting':
        return selectedProposal ? (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBackToDashboard}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <VotingInterface
              proposal={selectedProposal}
              userAddress={userAddress}
              onVoteCast={handleVoteCast}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardContent className="text-center py-12">
                <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Proposal Selected
                </h3>
                <p className="text-gray-600 mb-6">
                  Please select a proposal from the dashboard to view voting details.
                </p>
                <Button onClick={handleBackToDashboard}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'create':
        return (
          <div>
            <div className="max-w-4xl mx-auto p-6">
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={handleBackToDashboard}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
              <ProposalCreation
                onProposalCreated={handleProposalCreated}
                onCancel={handleBackToDashboard}
              />
            </div>
          </div>
        );
      
      case 'stakeholders':
        return (
          <div>
            <div className="mb-6 max-w-6xl mx-auto p-6">
              <Button 
                variant="outline" 
                onClick={handleBackToDashboard}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <StakeholderManagement userAddress={userAddress} />
          </div>
        );
      
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={handleBackToDashboard}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Governance Settings</CardTitle>
                <CardDescription>
                  Configure governance parameters and system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Settings Panel
                  </h3>
                  <p className="text-gray-600">
                    Governance settings and configuration options will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <GovernanceDashboard userAddress={userAddress} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FlowGrow Governance</h1>
              <p className="text-gray-600 text-sm">
                Decentralized decision making for the property marketplace
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setCurrentView('dashboard')}
                size="sm"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              <Button
                variant={currentView === 'stakeholders' ? 'default' : 'outline'}
                onClick={() => setCurrentView('stakeholders')}
                size="sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Stakeholders
              </Button>
              
              <Button
                variant={currentView === 'create' ? 'default' : 'outline'}
                onClick={() => setCurrentView('create')}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {renderCurrentView()}
      </div>

      {/* Quick Actions Floating Button */}
      {currentView === 'dashboard' && (
        <div className="fixed bottom-6 right-6">
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setCurrentView('create')}
              className="rounded-full w-14 h-14 shadow-lg"
              size="lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export individual components for direct use
export { GovernanceDashboard } from './GovernanceDashboard';
export { VotingInterface } from './VotingInterface';
export { ProposalCreation } from './ProposalCreation';
export { StakeholderManagement } from './StakeholderManagement';
