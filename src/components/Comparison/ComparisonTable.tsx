import React from 'react';
import { PropertyComparison, ComparisonResult } from '../../types/comparison';

interface ComparisonTableProps {
  comparison: PropertyComparison;
  results?: ComparisonResult[];
  onRemoveProperty: (propertyId: string) => void;
  loading?: boolean;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparison,
  results = [],
  onRemoveProperty,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (comparison.properties.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No properties in this comparison. Add properties to get started.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bedrooms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bathrooms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year Built
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {comparison.properties.map((property) => {
            const result = results.find(r => r.propertyId === property.propertyId);
            return (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {property.property.imageUrl && (
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={property.property.imageUrl}
                          alt={property.property.title}
                        />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {property.property.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.property.address}
                      </div>
                      {property.notes && (
                        <div className="text-xs text-gray-400 mt-1">
                          {property.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${property.property.price.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {property.property.squareFeet?.toLocaleString()} sq ft
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {property.property.bedrooms || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {property.property.bathrooms || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {property.property.yearBuilt || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {result && (
                    <div className="flex items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(result.totalScore)}`}>
                        {result.totalScore}/100
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        Rank #{result.rank}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onRemoveProperty(property.propertyId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};