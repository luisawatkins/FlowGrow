'use client';

import React from 'react';
import { PropertyManagementDashboard } from './PropertyManagementDashboard';

interface PropertyManagementProps {
  className?: string;
}

export const PropertyManagement: React.FC<PropertyManagementProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <PropertyManagementDashboard />
    </div>
  );
};

export default PropertyManagement;