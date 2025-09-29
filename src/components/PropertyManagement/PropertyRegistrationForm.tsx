'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Building2, 
  X, 
  Save,
  AlertCircle
} from 'lucide-react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

interface PropertyRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
  className?: string;
}

export const PropertyRegistrationForm: React.FC<PropertyRegistrationFormProps> = ({
  onClose,
  onSuccess,
  className = ''
}) => {
  const { registerProperty } = usePropertyManagement();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    propertyId: '',
    manager: '',
    rentAmount: '',
    rentDueDate: '',
    maintenanceFund: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.propertyId.trim()) {
      setError('Property ID is required');
      return false;
    }
    if (!formData.rentAmount.trim()) {
      setError('Rent amount is required');
      return false;
    }
    if (!formData.rentDueDate.trim()) {
      setError('Rent due date is required');
      return false;
    }
    if (!formData.maintenanceFund.trim()) {
      setError('Maintenance fund is required');
      return false;
    }

    const rentAmount = parseFloat(formData.rentAmount);
    const maintenanceFund = parseFloat(formData.maintenanceFund);
    const rentDueDate = new Date(formData.rentDueDate).getTime();

    if (isNaN(rentAmount) || rentAmount <= 0) {
      setError('Rent amount must be a positive number');
      return false;
    }
    if (isNaN(maintenanceFund) || maintenanceFund < 0) {
      setError('Maintenance fund must be a non-negative number');
      return false;
    }
    if (isNaN(rentDueDate)) {
      setError('Invalid rent due date');
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
      const success = await registerProperty({
        propertyId: parseInt(formData.propertyId),
        manager: formData.manager.trim() || undefined,
        rentAmount: parseFloat(formData.rentAmount),
        rentDueDate: new Date(formData.rentDueDate).getTime(),
        maintenanceFund: parseFloat(formData.maintenanceFund)
      });

      if (success) {
        onSuccess();
      } else {
        setError('Failed to register property. Please try again.');
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Register New Property
          </DialogTitle>
          <DialogDescription>
            Add a new property to your management portfolio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property ID */}
            <div className="space-y-2">
              <Label htmlFor="propertyId">Property ID *</Label>
              <Input
                id="propertyId"
                type="number"
                placeholder="Enter property ID"
                value={formData.propertyId}
                onChange={(e) => handleInputChange('propertyId', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <Label htmlFor="manager">Manager (Optional)</Label>
              <Input
                id="manager"
                type="text"
                placeholder="Enter manager address"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rent Amount */}
            <div className="space-y-2">
              <Label htmlFor="rentAmount">Monthly Rent Amount *</Label>
              <Input
                id="rentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.rentAmount}
                onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Maintenance Fund */}
            <div className="space-y-2">
              <Label htmlFor="maintenanceFund">Maintenance Fund *</Label>
              <Input
                id="maintenanceFund"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.maintenanceFund}
                onChange={(e) => handleInputChange('maintenanceFund', e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Rent Due Date */}
          <div className="space-y-2">
            <Label htmlFor="rentDueDate">Rent Due Date *</Label>
            <Input
              id="rentDueDate"
              type="date"
              value={formData.rentDueDate}
              onChange={(e) => handleInputChange('rentDueDate', e.target.value)}
              disabled={loading}
              required
            />
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
              {loading ? 'Registering...' : 'Register Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

