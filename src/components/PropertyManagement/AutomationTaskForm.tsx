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
  Bot, 
  X, 
  Save,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { AutomationTaskType, ScheduleType } from '@/types/propertyManagement';

interface AutomationTaskFormProps {
  onClose: () => void;
  onSuccess: () => void;
  className?: string;
}

interface Parameter {
  key: string;
  value: string;
}

export const AutomationTaskForm: React.FC<AutomationTaskFormProps> = ({
  onClose,
  onSuccess,
  className = ''
}) => {
  const { createAutomationTask, properties } = usePropertyManagement();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    taskId: '',
    taskType: AutomationTaskType.RENT_COLLECTION,
    propertyId: '',
    scheduleType: ScheduleType.MONTHLY,
    interval: '',
    startTime: '',
    endTime: '',
    timezone: 'UTC'
  });
  const [parameters, setParameters] = useState<Parameter[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const addParameter = () => {
    const newParameter: Parameter = {
      key: '',
      value: ''
    };
    setParameters(prev => [...prev, newParameter]);
  };

  const removeParameter = (index: number) => {
    setParameters(prev => prev.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: keyof Parameter, value: string) => {
    setParameters(prev => 
      prev.map((param, i) => 
        i === index 
          ? { ...param, [field]: value }
          : param
      )
    );
  };

  const getDefaultParameters = (taskType: AutomationTaskType) => {
    switch (taskType) {
      case AutomationTaskType.RENT_COLLECTION:
        return [
          { key: 'amount', value: '2000' },
          { key: 'tenantCount', value: '1' }
        ];
      case AutomationTaskType.MAINTENANCE_REMINDER:
        return [
          { key: 'reminderType', value: 'GENERAL' },
          { key: 'recipients', value: '1' }
        ];
      case AutomationTaskType.LEASE_RENEWAL:
        return [
          { key: 'tenantId', value: '1' },
          { key: 'newEndDate', value: '0' }
        ];
      case AutomationTaskType.PROPERTY_INSPECTION:
        return [
          { key: 'inspectionType', value: 'ROUTINE' },
          { key: 'scheduledDate', value: '0' }
        ];
      case AutomationTaskType.UTILITY_PAYMENT:
        return [
          { key: 'utilityType', value: 'GENERAL' },
          { key: 'amount', value: '0' }
        ];
      case AutomationTaskType.MARKET_ANALYSIS:
        return [
          { key: 'analysisType', value: 'COMPREHENSIVE' },
          { key: 'marketValue', value: '0' }
        ];
      default:
        return [];
    }
  };

  const handleTaskTypeChange = (taskType: AutomationTaskType) => {
    setFormData(prev => ({ ...prev, taskType }));
    setParameters(getDefaultParameters(taskType));
  };

  const validateForm = () => {
    if (!formData.taskId.trim()) {
      setError('Task ID is required');
      return false;
    }
    if (!formData.propertyId.trim()) {
      setError('Property ID is required');
      return false;
    }
    if (!formData.interval.trim()) {
      setError('Interval is required');
      return false;
    }
    if (!formData.startTime.trim()) {
      setError('Start time is required');
      return false;
    }

    const taskId = parseInt(formData.taskId);
    const propertyId = parseInt(formData.propertyId);
    const interval = parseInt(formData.interval);
    const startTime = new Date(formData.startTime).getTime();

    if (isNaN(taskId) || taskId <= 0) {
      setError('Task ID must be a positive number');
      return false;
    }
    if (isNaN(propertyId) || propertyId <= 0) {
      setError('Property ID must be a positive number');
      return false;
    }
    if (isNaN(interval) || interval <= 0) {
      setError('Interval must be a positive number');
      return false;
    }
    if (isNaN(startTime)) {
      setError('Invalid start time');
      return false;
    }

    if (formData.endTime) {
      const endTime = new Date(formData.endTime).getTime();
      if (isNaN(endTime) || endTime <= startTime) {
        setError('End time must be after start time');
        return false;
      }
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
      const parametersObj: Record<string, string> = {};
      parameters.forEach(param => {
        if (param.key.trim() && param.value.trim()) {
          parametersObj[param.key.trim()] = param.value.trim();
        }
      });

      const success = await createAutomationTask({
        taskId: parseInt(formData.taskId),
        taskType: formData.taskType,
        propertyId: parseInt(formData.propertyId),
        schedule: {
          scheduleType: formData.scheduleType,
          interval: parseInt(formData.interval),
          startTime: new Date(formData.startTime).getTime(),
          endTime: formData.endTime ? new Date(formData.endTime).getTime() : undefined,
          timezone: formData.timezone,
          customSchedule: undefined
        },
        parameters: parametersObj
      });

      if (success) {
        onSuccess();
      } else {
        setError('Failed to create automation task. Please try again.');
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

  const formatTaskType = (taskType: AutomationTaskType) => {
    return taskType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Create Automation Task
          </DialogTitle>
          <DialogDescription>
            Set up an automated task for property management
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskId">Task ID *</Label>
                <Input
                  id="taskId"
                  type="number"
                  placeholder="Enter task ID"
                  value={formData.taskId}
                  onChange={(e) => handleInputChange('taskId', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="taskType">Task Type *</Label>
                <Select
                  value={formData.taskType}
                  onValueChange={(value) => handleTaskTypeChange(value as AutomationTaskType)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AutomationTaskType.RENT_COLLECTION}>
                      {formatTaskType(AutomationTaskType.RENT_COLLECTION)}
                    </SelectItem>
                    <SelectItem value={AutomationTaskType.MAINTENANCE_REMINDER}>
                      {formatTaskType(AutomationTaskType.MAINTENANCE_REMINDER)}
                    </SelectItem>
                    <SelectItem value={AutomationTaskType.LEASE_RENEWAL}>
                      {formatTaskType(AutomationTaskType.LEASE_RENEWAL)}
                    </SelectItem>
                    <SelectItem value={AutomationTaskType.PROPERTY_INSPECTION}>
                      {formatTaskType(AutomationTaskType.PROPERTY_INSPECTION)}
                    </SelectItem>
                    <SelectItem value={AutomationTaskType.UTILITY_PAYMENT}>
                      {formatTaskType(AutomationTaskType.UTILITY_PAYMENT)}
                    </SelectItem>
                    <SelectItem value={AutomationTaskType.MARKET_ANALYSIS}>
                      {formatTaskType(AutomationTaskType.MARKET_ANALYSIS)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Schedule Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleType">Schedule Type *</Label>
                <Select
                  value={formData.scheduleType}
                  onValueChange={(value) => handleInputChange('scheduleType', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ScheduleType.DAILY}>Daily</SelectItem>
                    <SelectItem value={ScheduleType.WEEKLY}>Weekly</SelectItem>
                    <SelectItem value={ScheduleType.MONTHLY}>Monthly</SelectItem>
                    <SelectItem value={ScheduleType.QUARTERLY}>Quarterly</SelectItem>
                    <SelectItem value={ScheduleType.YEARLY}>Yearly</SelectItem>
                    <SelectItem value={ScheduleType.CUSTOM}>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Interval (seconds) *</Label>
                <Input
                  id="interval"
                  type="number"
                  placeholder="Enter interval in seconds"
                  value={formData.interval}
                  onChange={(e) => handleInputChange('interval', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time (Optional)</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange('timezone', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Task Parameters</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParameter}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Parameter
              </Button>
            </div>

            <div className="space-y-4">
              {parameters.map((parameter, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Parameter #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeParameter(index)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Key</Label>
                      <Input
                        placeholder="Enter parameter key"
                        value={parameter.key}
                        onChange={(e) => updateParameter(index, 'key', e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        placeholder="Enter parameter value"
                        value={parameter.value}
                        onChange={(e) => updateParameter(index, 'value', e.target.value)}
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
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


