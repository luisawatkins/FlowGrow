import React from 'react';
import { ComparisonResult } from '../../types/comparison';

interface ComparisonResultsProps {
  results: ComparisonResult[];
  loading?: boolean;
}

export const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  results,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comparison results available. Add properties to compare them.</p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Results</h3>
        
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.propertyId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getRankIcon(result.rank)}</span>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{result.propertyTitle}</h4>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(result.totalScore)}`}>
                        {result.totalScore}/100
                      </span>
                      <span className="text-sm text-gray-500">Overall Score</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Strengths</h5>
                  <ul className="text-sm text-green-600 space-y-1">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h5>
                  <ul className="text-sm text-red-600 space-y-1">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">⚠</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Detailed Scores</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(result.criteriaScores).map(([criteriaId, score]) => (
                    <div key={criteriaId} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">
                        {criteriaId.replace('crit-', 'Criteria ')}
                      </div>
                      <div className={`text-lg font-semibold ${getScoreColor(score).split(' ')[0]}`}>
                        {score}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
