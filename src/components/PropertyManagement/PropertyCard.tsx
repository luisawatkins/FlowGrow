'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Wrench, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';
import { PropertyManagement } from '@/types/propertyManagement';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

interface PropertyCardProps {
  property: PropertyManagement;
  onEdit?: (property: PropertyManagement) => void;
  onDelete?: (propertyId: number) => void;
  onView?: (property: PropertyManagement) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete,
  onView
}) => {
  const { getPropertyPerformance } = usePropertyManagement();
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const loadPerformance = async () => {
    setLoading(true);
    try {
      const perf = await getPropertyPerformance(property.propertyId);
      setPerformance(perf);
    } catch (error) {
      console.error('Failed to load property performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getOccupancyRate = () => {
    // Assuming max 4 tenants per property
    const maxTenants = 4;
    return Math.round((property.tenantCount / maxTenants) * 100);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Property #{property.propertyId}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(property.isActive)}>
              {property.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      onView?.(property);
                      setShowMenu(false);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      onEdit?.(property);
                      setShowMenu(false);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => {
                      onDelete?.(property.propertyId);
                      setShowMenu(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <CardDescription>
          {property.manager ? `Managed by ${property.manager}` : 'Self-managed'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(property.rentAmount)}
            </div>
            <div className="text-xs text-blue-600">Monthly Rent</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {getOccupancyRate()}%
            </div>
            <div className="text-xs text-green-600">Occupancy</div>
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tenants:</span>
            <span className="font-medium">{property.tenantCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Revenue:</span>
            <span className="font-medium">{formatCurrency(property.totalRevenue)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Maintenance Fund:</span>
            <span className="font-medium">{formatCurrency(property.maintenanceFund)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Rent Due:</span>
            <span className="font-medium">{formatDate(property.rentDueDate)}</span>
          </div>
        </div>

        {/* Maintenance Requests */}
        {property.maintenanceRequests.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <Wrench className="h-4 w-4 mr-1" />
                Maintenance Requests:
              </span>
              <Badge variant="secondary">
                {property.maintenanceRequests.length}
              </Badge>
            </div>
          </div>
        )}

        {/* Performance Section */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Performance</span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPerformance}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'View Details'}
            </Button>
          </div>
          
          {performance && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium">{performance.occupancyRate}%</div>
                <div className="text-muted-foreground">Occupancy</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium">{formatCurrency(performance.revenuePerMonth)}</div>
                <div className="text-muted-foreground">Monthly Revenue</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView?.(property)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(property)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

