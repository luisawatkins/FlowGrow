'use client';

import React, { useState, useEffect } from 'react';
import { StakeholderProfile, StakeholderRegistrationData, VerificationLevel, StakeholderStatus } from '@/types/governance';
import { useGovernance } from '@/hooks/useGovernance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Users, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  Save,
  X,
  Building,
  Mail,
  Calendar,
  Award,
  DollarSign
} from 'lucide-react';

interface StakeholderManagementProps {
  userAddress?: string;
}

export const StakeholderManagement: React.FC<StakeholderManagementProps> = ({ userAddress }) => {
  const {
    stakeholderProfile,
    stats,
    registerStakeholder,
    updateStakeholderProfile,
    isStakeholder,
    calculateVotingPower
  } = useGovernance(userAddress);

  const [isEditing, setIsEditing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userIsStakeholder, setUserIsStakeholder] = useState(false);
  const [userVotingPower, setUserVotingPower] = useState(0);

  const [formData, setFormData] = useState<StakeholderRegistrationData>({
    name: '',
    email: '',
    organization: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkStakeholderStatus = async () => {
      if (userAddress) {
        const isStakeholderResult = await isStakeholder(userAddress);
        const votingPower = await calculateVotingPower(userAddress);
        
        setUserIsStakeholder(isStakeholderResult);
        setUserVotingPower(votingPower);

        if (stakeholderProfile) {
          setFormData({
            name: stakeholderProfile.name || '',
            email: stakeholderProfile.email || '',
            organization: stakeholderProfile.organization || ''
          });
        }
      }
    };

    checkStakeholderStatus();
  }, [userAddress, stakeholderProfile, isStakeholder, calculateVotingPower]);

  const getVerificationLevelColor = (level: VerificationLevel) => {
    switch (level) {
      case VerificationLevel.Basic:
        return 'bg-gray-100 text-gray-800';
      case VerificationLevel.Verified:
        return 'bg-blue-100 text-blue-800';
      case VerificationLevel.Premium:
        return 'bg-purple-100 text-purple-800';
      case VerificationLevel.Institutional:
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: StakeholderStatus) => {
    switch (status) {
      case StakeholderStatus.Active:
        return 'bg-green-100 text-green-800';
      case StakeholderStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case StakeholderStatus.Suspended:
        return 'bg-red-100 text-red-800';
      case StakeholderStatus.Revoked:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.organization && formData.organization.length < 2) {
      newErrors.organization = 'Organization name must be at least 2 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerStakeholder(formData);
      setIsRegistering(false);
      setFormData({ name: '', email: '', organization: '' });
    } catch (error) {
      console.error('Error registering stakeholder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateStakeholderProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsRegistering(false);
    setFormData({
      name: stakeholderProfile?.name || '',
      email: stakeholderProfile?.email || '',
      organization: stakeholderProfile?.organization || ''
    });
    setErrors({});
  };

  const handleInputChange = (field: keyof StakeholderRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {userIsStakeholder ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">Stakeholder Profile</CardTitle>
                    <CardDescription>
                      Your governance participation and voting power
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                  >
                    {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          {stakeholderProfile?.name || 'Not provided'}
                        </div>
                      )}
                      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          {stakeholderProfile?.email || 'Not provided'}
                        </div>
                      )}
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      {isEditing ? (
                        <Input
                          id="organization"
                          value={formData.organization || ''}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          placeholder="Your organization (optional)"
                          className={errors.organization ? 'border-red-500' : ''}
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-md">
                          {stakeholderProfile?.organization || 'Not provided'}
                        </div>
                      )}
                      {errors.organization && <p className="text-sm text-red-600">{errors.organization}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Shield className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Verification Status</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Level:</span>
                          <Badge className={getVerificationLevelColor(stakeholderProfile?.verificationLevel || VerificationLevel.Basic)}>
                            {stakeholderProfile?.verificationLevel || 'Basic'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">Status:</span>
                          <Badge className={getStatusColor(stakeholderProfile?.status || StakeholderStatus.Pending)}>
                            {stakeholderProfile?.status || 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">KYC:</span>
                          <span className="text-sm">
                            {stakeholderProfile?.kycCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600 inline" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600 inline" />
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">AML:</span>
                          <span className="text-sm">
                            {stakeholderProfile?.amlCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600 inline" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-600 inline" />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Governance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">Voting Power</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {userVotingPower.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-700">
                      {((userVotingPower / (stats?.totalVotingPower || 1)) * 100).toFixed(2)}% of total
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Building className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-semibold text-purple-800">Properties</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {stakeholderProfile?.propertyCount || 0}
                    </div>
                    <div className="text-sm text-purple-700">
                      Properties owned
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="font-semibold text-orange-800">Total Value</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-900">
                      {(stakeholderProfile?.totalPropertyValue || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-700">
                      FLOW tokens
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Become a Stakeholder</CardTitle>
                <CardDescription>
                  Register as a stakeholder to participate in governance and voting
                </CardDescription>
              </CardHeader>

              <CardContent>
                {!isRegistering ? (
                  <div className="text-center py-8">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      You're not a stakeholder yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Register as a stakeholder to participate in governance decisions and vote on proposals.
                    </p>
                    <Button onClick={() => setIsRegistering(true)}>
                      <User className="h-4 w-4 mr-2" />
                      Register as Stakeholder
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="reg-name">Name</Label>
                        <Input
                          id="reg-name"
                          value={formData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="reg-organization">Organization (Optional)</Label>
                        <Input
                          id="reg-organization"
                          value={formData.organization || ''}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          placeholder="Your organization"
                          className={errors.organization ? 'border-red-500' : ''}
                        />
                        {errors.organization && <p className="text-sm text-red-600">{errors.organization}</p>}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Info className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Registration Benefits</span>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Participate in governance voting</li>
                        <li>• Create and submit proposals</li>
                        <li>• Access to stakeholder analytics</li>
                        <li>• Voting power based on property ownership</li>
                      </ul>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button onClick={handleRegister} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Registering...
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 mr-2" />
                            Register
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Stakeholder Community</CardTitle>
              <CardDescription>
                Overview of the governance community and participation
              </CardDescription>
            </CardHeader>

            <CardContent>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Users className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800">Total Stakeholders</h3>
                        <p className="text-3xl font-bold text-blue-900">{stats.totalStakeholders}</p>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700">
                      Active participants in governance
                    </p>
                  </div>

                  <div className="p-6 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">Participation Rate</h3>
                        <p className="text-3xl font-bold text-green-900">{stats.participationRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    <p className="text-sm text-green-700">
                      Average voting participation
                    </p>
                  </div>

                  <div className="p-6 bg-purple-50 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Award className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold text-purple-800">Total Voting Power</h3>
                        <p className="text-3xl font-bold text-purple-900">
                          {stats.totalVotingPower.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-purple-700">
                      Combined governance power
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 text-center py-8">
                <p className="text-gray-600">Community features and leaderboards will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Verification & Compliance</CardTitle>
              <CardDescription>
                Manage your verification status and compliance requirements
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verification System
                </h3>
                <p className="text-gray-600">
                  KYC/AML verification and compliance features will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
