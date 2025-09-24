import React from 'react';
import { Agent } from '@/types/agent';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AgentProfileProps {
  agent: Agent;
  onContact?: (agentId: string) => void;
  onViewProperties?: (agentId: string) => void;
  onScheduleMeeting?: (agentId: string) => void;
  showActions?: boolean;
}

export const AgentProfile: React.FC<AgentProfileProps> = ({
  agent,
  onContact,
  onViewProperties,
  onScheduleMeeting,
  showActions = true
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Agent Image and Basic Info */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {agent.profileImage ? (
              <img
                src={agent.profileImage}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {agent.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          
          {/* Verification Badge */}
          {agent.isVerified && (
            <div className="mt-2 flex items-center justify-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Agent Details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{agent.name}</h3>
              <p className="text-gray-600 mb-2">{agent.brokerage}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>License: {agent.licenseNumber}</span>
                <span>•</span>
                <span>{agent.experience} years experience</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(agent.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {agent.rating} ({formatNumber(agent.reviewCount)} reviews)
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-700 mb-4 line-clamp-3">{agent.bio}</p>

          {/* Specialties */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {agent.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Service Areas</h4>
            <div className="flex flex-wrap gap-2">
              {agent.serviceAreas.map((area, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{agent.totalSales}</div>
              <div className="text-xs text-gray-500">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(agent.totalVolume)}
              </div>
              <div className="text-xs text-gray-500">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{agent.averageDaysOnMarket}</div>
              <div className="text-xs text-gray-500">Avg Days on Market</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{agent.commissionRate}%</div>
              <div className="text-xs text-gray-500">Commission Rate</div>
            </div>
          </div>

          {/* Languages */}
          {agent.languages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {agent.languages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {agent.certifications.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {agent.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={() => onContact?.(agent.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Contact Agent
              </Button>
              <Button
                onClick={() => onViewProperties?.(agent.id)}
                variant="outline"
                className="flex-1"
              >
                View Properties
              </Button>
              <Button
                onClick={() => onScheduleMeeting?.(agent.id)}
                variant="outline"
                className="flex-1"
              >
                Schedule Meeting
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
