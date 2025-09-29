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
  Wrench, 
  X, 
  Save,
  AlertCircle
} from 'lucide-react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { MaintenancePriority } from '@/types/propertyManagement';

interface MaintenanceRequestFormProps {
  onClose: () => void;
  onSuccess: () => void;
  className?: string;
}

export const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({
  onClose,
  onSuccess,
  className = ''
}) => {
  const { createMaintenanceRequest, properties, tenants } = usePropertyManagement();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    requestId: '',
    propertyId: '',
    tenantId: '',
    description: '',
    priority: MaintenancePriority.MEDIUM,
    estimatedCost: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.requestId.trim()) {
      setError('Request ID is required');
      return false;
    }
    if (!formData.propertyId.trim()) {
      setError('Property ID is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.estimatedCost.trim()) {
      setError('Estimated cost is required');
      return false;
    }

    const requestId = parseInt(formData.requestId);
    const propertyId = parseInt(formData.propertyId);
    const estimatedCost = parseFloat(formData.estimatedCost);

    if (isNaN(requestId) || requestId <= 0) {
      setError('Request ID must be a positive number');
      return false;
    }
    if (isNaN(propertyId) || propertyId <= 0) {
      setError('Property ID must be a positive number');
      return false;
    }
    if (isNaN(estimatedCost) || estimatedCost < 0) {
      setError('Estimated cost must be a non-negative number');
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
      const success = await createMaintenanceRequest({
        requestId: parseInt(formData.requestId),
        propertyId: parseInt(formData.propertyId),
        tenantId: formData.tenantId ? parseInt(formData.tenantId) : undefined,
        description: formData.description.trim(),
        priority: formData.priority,
        estimatedCost: parseFloat(formData.estimatedCost)
      });

      if (success) {
        onSuccess();
      } else {
        setError('Failed to create maintenance request. Please try again.');
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
            <Wrench className="h-5 w-5 mr-2" />
            Create Maintenance Request
          </DialogTitle>
          <DialogDescription>
            Submit a new maintenance request for a property
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request ID */}
            <div className="space-y-2">
              <Label htmlFor="requestId">Request ID *</Label>
              <Input
                id="requestId"
                type="number"
                placeholder="Enter request ID"
                value={formData.requestId}
                onChange={(e) => handleInputChange('requestId', e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Property ID */}
            <div className="space-y-2">
              <Label htmlFor="propertyId">Property ID *</Label>
              <Select
                value={formData.propertyId}
                onValueChange={(value) => handleInputChange('propertyId', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.propertyId} value={property.propertyId.toString()}>
                      Property #{property.propertyId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tenant ID (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant ID (Optional)</Label>
            <Select
              value={formData.tenantId}
              onValueChange={(value) => handleInputChange('tenantId', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tenant (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No tenant specified</SelectItem>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.tenantId} value={tenant.tenantId.toString()}>
                    Tenant #{tenant.tenantId} - Property #{tenant.propertyId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the maintenance issue in detail..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MaintenancePriority.LOW}>Low</SelectItem>
                  <SelectItem value={MaintenancePriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={MaintenancePriority.HIGH}>High</SelectItem>
                  <SelectItem value={MaintenancePriority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Cost */}
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost *</Label>
              <Input
                id="estimatedCost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.estimatedCost}
                onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                disabled={loading}
                required
              />
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
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

