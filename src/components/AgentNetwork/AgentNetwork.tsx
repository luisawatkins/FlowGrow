import React, { useState } from 'react';
import { Agent } from '@/types/agent';
import { AgentSearch } from './AgentSearch';
import { AgentProfile } from './AgentProfile';
import { AgentDashboard } from './AgentDashboard';
import { CommissionTracker } from './CommissionTracker';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AgentNetworkProps {
  onAgentSelect?: (agent: Agent) => void;
  showDashboard?: boolean;
  showCommissionTracker?: boolean;
}

export const AgentNetwork: React.FC<AgentNetworkProps> = ({
  onAgentSelect,
  showDashboard = false,
  showCommissionTracker = false
}) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'dashboard' | 'commissions'>('search');

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    onAgentSelect?.(agent);
  };

  const handleContactAgent = (agentId: string) => {
    const agent = selectedAgent;
    if (agent) {
      // In a real app, this would open a contact form or messaging system
      alert(`Contacting ${agent.name} at ${agent.email} or ${agent.phone}`);
    }
  };

  const handleViewProperties = (agentId: string) => {
    // In a real app, this would navigate to the agent's properties
    alert(`Viewing properties for agent ${agentId}`);
  };

  const handleScheduleMeeting = (agentId: string) => {
    // In a real app, this would open a scheduling system
    alert(`Scheduling meeting with agent ${agentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real Estate Agent Network</h1>
          <p className="text-gray-600 mt-2">
            Connect with verified real estate professionals in your area
          </p>
        </div>
        {selectedAgent && (
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => setSelectedAgent(null)}
              variant="outline"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">🔍</span>
            Find Agents
          </button>
          {showDashboard && selectedAgent && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">📊</span>
              Dashboard
            </button>
          )}
          {showCommissionTracker && selectedAgent && (
            <button
              onClick={() => setActiveTab('commissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'commissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">💰</span>
              Commissions
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Agent Search */}
          <AgentSearch
            onAgentSelect={handleAgentSelect}
            showResults={true}
            maxResults={10}
          />

          {/* Selected Agent Details */}
          {selectedAgent && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Selected Agent Details
              </h2>
              <AgentProfile
                agent={selectedAgent}
                onContact={handleContactAgent}
                onViewProperties={handleViewProperties}
                onScheduleMeeting={handleScheduleMeeting}
                showActions={true}
              />
            </Card>
          )}
        </div>
      )}

      {activeTab === 'dashboard' && selectedAgent && (
        <AgentDashboard agentId={selectedAgent.id} />
      )}

      {activeTab === 'commissions' && selectedAgent && (
        <CommissionTracker agentId={selectedAgent.id} />
      )}

      {/* Features Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Agent Network Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Advanced Search</h3>
            <p className="text-sm text-gray-600">
              Find agents by location, specialties, experience, and ratings
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Verified Agents</h3>
            <p className="text-sm text-gray-600">
              All agents are verified with valid licenses and credentials
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Performance Tracking</h3>
            <p className="text-sm text-gray-600">
              View agent performance metrics and commission history
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Brokerage Network</h3>
            <p className="text-sm text-gray-600">
              Connect with top-rated brokerages and their agents
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Commission Tracking</h3>
            <p className="text-sm text-gray-600">
              Track and calculate commissions with detailed breakdowns
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Direct Communication</h3>
            <p className="text-sm text-gray-600">
              Contact agents directly through the platform
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
