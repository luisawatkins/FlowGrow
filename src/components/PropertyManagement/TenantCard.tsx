'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MessageSquare
} from 'lucide-react';
import { TenantInfo } from '@/types/propertyManagement';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

interface TenantCardProps {
  tenant: TenantInfo;
  onEdit?: (tenant: TenantInfo) => void;
  onDelete?: (tenantId: number) => void;
  onView?: (tenant: TenantInfo) => void;
  onMessage?: (tenant: TenantInfo) => void;
}

export const TenantCard: React.FC<TenantCardProps> = ({
  tenant,
  onEdit,
  onDelete,
  onView,
  onMessage
}) => {
  const { processRentPayment } = usePropertyManagement();
  const [showMenu, setShowMenu] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

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

  const getLeaseStatus = () => {
    const now = Date.now();
    if (now < tenant.leaseStartDate) {
      return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800' };
    } else if (now > tenant.leaseEndDate) {
      return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    } else {
      return { status: 'Active', color: 'bg-green-100 text-green-800' };
    }
  };

  const getPaymentStatus = () => {
    const lastPayment = tenant.paymentHistory[tenant.paymentHistory.length - 1];
    if (!lastPayment) {
      return { status: 'No Payments', color: 'bg-gray-100 text-gray-800' };
    }
    
    const daysSincePayment = (Date.now() - lastPayment.paymentDate) / (1000 * 60 * 60 * 24);
    if (daysSincePayment > 30) {
      return { status: 'Overdue', color: 'bg-red-100 text-red-800' };
    } else if (daysSincePayment > 15) {
      return { status: 'Due Soon', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'Current', color: 'bg-green-100 text-green-800' };
    }
  };

  const handleRentPayment = async () => {
    setProcessingPayment(true);
    try {
      await processRentPayment({
        tenantId: tenant.tenantId,
        amount: tenant.monthlyRent,
        paymentType: 'MONTHLY_RENT'
      });
    } catch (error) {
      console.error('Failed to process rent payment:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const leaseStatus = getLeaseStatus();
  const paymentStatus = getPaymentStatus();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Tenant #{tenant.tenantId}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(tenant.isActive)}>
              {tenant.isActive ? 'Active' : 'Inactive'}
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
                      onView?.(tenant);
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
                      onMessage?.(tenant);
                      setShowMenu(false);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      onEdit?.(tenant);
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
                      onDelete?.(tenant.tenantId);
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
          Property #{tenant.propertyId} • {tenant.tenantAddress}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(tenant.monthlyRent)}
            </div>
            <div className="text-xs text-blue-600">Monthly Rent</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(tenant.securityDeposit)}
            </div>
            <div className="text-xs text-green-600">Security Deposit</div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex space-x-2">
          <Badge className={leaseStatus.color}>
            {leaseStatus.status}
          </Badge>
          <Badge className={paymentStatus.color}>
            {paymentStatus.status}
          </Badge>
        </div>

        {/* Lease Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Lease Start:
            </span>
            <span className="font-medium">{formatDate(tenant.leaseStartDate)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Lease End:
            </span>
            <span className="font-medium">{formatDate(tenant.leaseEndDate)}</span>
          </div>
        </div>

        {/* Payment History */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Payment History:</span>
            <span className="font-medium">{tenant.paymentHistory.length} payments</span>
          </div>
          
          {tenant.paymentHistory.length > 0 && (
            <div className="space-y-1">
              {tenant.paymentHistory.slice(-3).map((payment, index) => (
                <div key={payment.paymentId} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    {payment.isLate ? (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                    <span>{formatDate(payment.paymentDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{formatCurrency(payment.amount)}</span>
                    {payment.lateFee > 0 && (
                      <span className="text-red-500">+{formatCurrency(payment.lateFee)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Requests */}
        {tenant.maintenanceRequests.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Maintenance Requests:</span>
              <Badge variant="secondary">
                {tenant.maintenanceRequests.length}
              </Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleRentPayment}
            disabled={processingPayment}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            {processingPayment ? 'Processing...' : 'Process Rent'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessage?.(tenant)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

