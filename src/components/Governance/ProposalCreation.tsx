'use client';

import React, { useState } from 'react';
import { ProposalFormData, ProposalType } from '@/types/governance';
import { useGovernance } from '@/hooks/useGovernance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  AlertTriangle, 
  Info, 
  Clock, 
  Target,
  FileText,
  Settings
} from 'lucide-react';

interface ProposalCreationProps {
  onProposalCreated?: (proposalId: number) => void;
  onCancel?: () => void;
}

export const ProposalCreation: React.FC<ProposalCreationProps> = ({ 
  onProposalCreated, 
  onCancel 
}) => {
  const { createProposal, stats } = useGovernance();
  
  const [formData, setFormData] = useState<ProposalFormData>({
    title: '',
    description: '',
    proposalType: ProposalType.PropertyRule,
    votingDuration: 7, // 7 days default
    quorumRequired: 10, // 10% default
    executionData: '',
    targetContract: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const proposalTypes = [
    { value: ProposalType.PropertyRule, label: 'Property Rule', description: 'Changes to property-related rules and regulations' },
    { value: ProposalType.FeeChange, label: 'Fee Change', description: 'Modifications to platform fees and charges' },
    { value: ProposalType.ContractUpgrade, label: 'Contract Upgrade', description: 'Smart contract upgrades and improvements' },
    { value: ProposalType.CommunityFund, label: 'Community Fund', description: 'Allocation of community treasury funds' },
    { value: ProposalType.EmergencyAction, label: 'Emergency Action', description: 'Urgent actions requiring immediate attention' }
  ];

  const votingDurations = [
    { value: 1, label: '1 Day', description: 'Quick decisions' },
    { value: 3, label: '3 Days', description: 'Standard proposals' },
    { value: 7, label: '7 Days', description: 'Complex proposals' },
    { value: 14, label: '14 Days', description: 'Major changes' },
    { value: 30, label: '30 Days', description: 'Constitutional changes' }
  ];

  const quorumOptions = [
    { value: 5, label: '5%', description: 'Low threshold' },
    { value: 10, label: '10%', description: 'Standard threshold' },
    { value: 15, label: '15%', description: 'High threshold' },
    { value: 25, label: '25%', description: 'Very high threshold' },
    { value: 50, label: '50%', description: 'Majority threshold' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (formData.votingDuration < 1 || formData.votingDuration > 30) {
      newErrors.votingDuration = 'Voting duration must be between 1 and 30 days';
    }

    if (formData.quorumRequired < 1 || formData.quorumRequired > 100) {
      newErrors.quorumRequired = 'Quorum must be between 1% and 100%';
    }

    // Validate execution data if provided
    if (formData.executionData && formData.executionData.trim()) {
      try {
        JSON.parse(formData.executionData);
      } catch {
        newErrors.executionData = 'Execution data must be valid JSON';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const proposalId = await createProposal(formData);
      onProposalCreated?.(proposalId);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        proposalType: ProposalType.PropertyRule,
        votingDuration: 7,
        quorumRequired: 10,
        executionData: '',
        targetContract: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating proposal:', error);
      setErrors({ submit: 'Failed to create proposal. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ProposalFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getSelectedProposalType = () => {
    return proposalTypes.find(type => type.value === formData.proposalType);
  };

  const getSelectedVotingDuration = () => {
    return votingDurations.find(duration => duration.value === formData.votingDuration);
  };

  const getSelectedQuorum = () => {
    return quorumOptions.find(quorum => quorum.value === formData.quorumRequired);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Create New Proposal</CardTitle>
              <CardDescription className="mt-2">
                Submit a proposal for community governance and voting
              </CardDescription>
            </div>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Proposal Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Proposal Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {proposalTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.proposalType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('proposalType', type.value)}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        formData.proposalType === type.value ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                ))}
              </div>
              {errors.proposalType && (
                <p className="text-sm text-red-600">{errors.proposalType}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Proposal Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a clear, concise title for your proposal"
                className={errors.title ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{errors.title || 'Be specific and descriptive'}</span>
                <span>{formData.title.length}/100</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Proposal Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of your proposal, including the rationale, expected outcomes, and any potential risks or considerations..."
                rows={6}
                className={errors.description ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{errors.description || 'Include all relevant details and context'}</span>
                <span>{formData.description.length}/2000</span>
              </div>
            </div>

            {/* Voting Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voting Duration */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Voting Duration</Label>
                <Select
                  value={formData.votingDuration.toString()}
                  onValueChange={(value) => handleInputChange('votingDuration', parseInt(value))}
                >
                  <SelectTrigger className={errors.votingDuration ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {votingDurations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        <div>
                          <div className="font-medium">{duration.label}</div>
                          <div className="text-sm text-gray-500">{duration.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.votingDuration && (
                  <p className="text-sm text-red-600">{errors.votingDuration}</p>
                )}
              </div>

              {/* Quorum Required */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Quorum Required</Label>
                <Select
                  value={formData.quorumRequired.toString()}
                  onValueChange={(value) => handleInputChange('quorumRequired', parseInt(value))}
                >
                  <SelectTrigger className={errors.quorumRequired ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {quorumOptions.map((quorum) => (
                      <SelectItem key={quorum.value} value={quorum.value.toString()}>
                        <div>
                          <div className="font-medium">{quorum.label}</div>
                          <div className="text-sm text-gray-500">{quorum.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.quorumRequired && (
                  <p className="text-sm text-red-600">{errors.quorumRequired}</p>
                )}
              </div>
            </div>

            {/* Execution Data (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="executionData" className="text-base font-semibold">
                Execution Data (Optional)
              </Label>
              <Textarea
                id="executionData"
                value={formData.executionData}
                onChange={(e) => handleInputChange('executionData', e.target.value)}
                placeholder='{"key": "value"} - JSON data for proposal execution'
                rows={3}
                className={errors.executionData ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{errors.executionData || 'JSON data that will be used when executing the proposal'}</span>
              </div>
            </div>

            {/* Target Contract (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="targetContract" className="text-base font-semibold">
                Target Contract (Optional)
              </Label>
              <Input
                id="targetContract"
                value={formData.targetContract}
                onChange={(e) => handleInputChange('targetContract', e.target.value)}
                placeholder="Contract address that will be affected by this proposal"
                className={errors.targetContract ? 'border-red-500' : ''}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{errors.targetContract || 'Address of the contract to be modified'}</span>
              </div>
            </div>

            {/* Proposal Summary */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">Proposal Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <Badge className="ml-2">{getSelectedProposalType()?.label}</Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="ml-2">{getSelectedVotingDuration()?.label}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Quorum:</span>
                  <span className="ml-2">{getSelectedQuorum()?.label}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Total Voting Power:</span>
                  <span className="ml-2">{stats?.totalVotingPower.toLocaleString() || 'Loading...'}</span>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Proposal
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
