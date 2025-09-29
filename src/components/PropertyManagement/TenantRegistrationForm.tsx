'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  X, 
  Save,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { EmploymentType } from '@/types/propertyManagement';

interface TenantRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
  className?: string;
}

interface Reference {
  referenceId: number;
  name: string;
  relationship: string;
  contact: string;
}

export const TenantRegistrationForm: React.FC<TenantRegistrationFormProps> = ({
  onClose,
  onSuccess,
  className = ''
}) => {
  const { registerTenant } = usePropertyManagement();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tenantId: '',
    address: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    employer: '',
    position: '',
    employmentStartDate: '',
    salary: '',
    employmentType: EmploymentType.FULL_TIME,
    employerContact: '',
    creditScore: '',
    income: ''
  });
  const [references, setReferences] = useState<Reference[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const addReference = () => {
    const newReference: Reference = {
      referenceId: Date.now(),
      name: '',
      relationship: '',
      contact: ''
    };
    setReferences(prev => [...prev, newReference]);
  };

  const removeReference = (referenceId: number) => {
    setReferences(prev => prev.filter(ref => ref.referenceId !== referenceId));
  };

  const updateReference = (referenceId: number, field: keyof Reference, value: string) => {
    setReferences(prev => 
      prev.map(ref => 
        ref.referenceId === referenceId 
          ? { ...ref, [field]: value }
          : ref
      )
    );
  };

  const validateForm = () => {
    // Basic validation
    const requiredFields = ['tenantId', 'address', 'name', 'email', 'phone', 'dateOfBirth', 'ssn', 'employer', 'position', 'employmentStartDate', 'salary', 'employerContact', 'creditScore', 'income'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        setError(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        return false;
      }
    }

    // Numeric validation
    const creditScore = parseInt(formData.creditScore);
    const income = parseFloat(formData.income);
    const salary = parseFloat(formData.salary);

    if (isNaN(creditScore) || creditScore < 300 || creditScore > 850) {
      setError('Credit score must be between 300 and 850');
      return false;
    }
    if (isNaN(income) || income <= 0) {
      setError('Income must be a positive number');
      return false;
    }
    if (isNaN(salary) || salary <= 0) {
      setError('Salary must be a positive number');
      return false;
    }

    // Date validation
    const dateOfBirth = new Date(formData.dateOfBirth).getTime();
    const employmentStartDate = new Date(formData.employmentStartDate).getTime();

    if (isNaN(dateOfBirth)) {
      setError('Invalid date of birth');
      return false;
    }
    if (isNaN(employmentStartDate)) {
      setError('Invalid employment start date');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await registerTenant({
        tenantId: parseInt(formData.tenantId),
        address: formData.address.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: new Date(formData.dateOfBirth).getTime(),
        ssn: formData.ssn.trim(),
        employmentInfo: {
          employer: formData.employer.trim(),
          position: formData.position.trim(),
          startDate: new Date(formData.employmentStartDate).getTime(),
          salary: parseFloat(formData.salary),
          employmentType: formData.employmentType,
          employerContact: formData.employerContact.trim()
        },
        creditScore: parseInt(formData.creditScore),
        income: parseFloat(formData.income),
        references: references.map(ref => ({
          referenceId: ref.referenceId,
          name: ref.name.trim(),
          relationship: ref.relationship.trim(),
          contact: ref.contact.trim()
        }))
      });

      if (success) {
        onSuccess();
      } else {
        setError('Failed to register tenant. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Register New Tenant
          </DialogTitle>
          <DialogDescription>
            Add a new tenant to your property management system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant ID *</Label>
                <Input
                  id="tenantId"
                  type="number"
                  placeholder="Enter tenant ID"
                  value={formData.tenantId}
                  onChange={(e) => handleInputChange('tenantId', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="0x..."
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ssn">SSN *</Label>
                <Input
                  id="ssn"
                  type="text"
                  placeholder="XXX-XX-XXXX"
                  value={formData.ssn}
                  onChange={(e) => handleInputChange('ssn', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employer">Employer *</Label>
                <Input
                  id="employer"
                  type="text"
                  placeholder="Enter employer name"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  type="text"
                  placeholder="Enter job position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentStartDate">Employment Start Date *</Label>
                <Input
                  id="employmentStartDate"
                  type="date"
                  value={formData.employmentStartDate}
                  onChange={(e) => handleInputChange('employmentStartDate', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => handleInputChange('employmentType', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EmploymentType.FULL_TIME}>Full Time</SelectItem>
                    <SelectItem value={EmploymentType.PART_TIME}>Part Time</SelectItem>
                    <SelectItem value={EmploymentType.CONTRACT}>Contract</SelectItem>
                    <SelectItem value={EmploymentType.SELF_EMPLOYED}>Self Employed</SelectItem>
                    <SelectItem value={EmploymentType.UNEMPLOYED}>Unemployed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Annual Salary *</Label>
                <Input
                  id="salary"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employerContact">Employer Contact *</Label>
                <Input
                  id="employerContact"
                  type="email"
                  placeholder="Enter employer contact email"
                  value={formData.employerContact}
                  onChange={(e) => handleInputChange('employerContact', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score *</Label>
                <Input
                  id="creditScore"
                  type="number"
                  min="300"
                  max="850"
                  placeholder="300-850"
                  value={formData.creditScore}
                  onChange={(e) => handleInputChange('creditScore', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income">Annual Income *</Label>
                <Input
                  id="income"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          {/* References */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">References</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addReference}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reference
              </Button>
            </div>

            <div className="space-y-4">
              {references.map((reference) => (
                <div key={reference.referenceId} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Reference #{reference.referenceId}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReference(reference.referenceId)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Enter reference name"
                        value={reference.name}
                        onChange={(e) => updateReference(reference.referenceId, 'name', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Input
                        placeholder="e.g., Previous Landlord"
                        value={reference.relationship}
                        onChange={(e) => updateReference(reference.referenceId, 'relationship', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact</Label>
                      <Input
                        placeholder="Enter contact information"
                        value={reference.contact}
                        onChange={(e) => updateReference(reference.referenceId, 'contact', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Registering...' : 'Register Tenant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

