// Market Report Component

'use client';

import React, { useState } from 'react';
import { MarketReport, ReportSection, ChartType } from '@/types/market';

interface MarketReportProps {
  report: MarketReport | null;
  loading: boolean;
  error: any;
  onRefresh: () => void;
  onGenerate: () => void;
}

export const MarketReport: React.FC<MarketReportProps> = ({
  report,
  loading,
  error,
  onRefresh,
  onGenerate
}) => {
  const [selectedSection, setSelectedSection] = useState<ReportSection | null>(null);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatChartType = (type: ChartType): string => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-red-800 font-medium">Failed to load market report</h3>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
            <button
              onClick={onRefresh}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No report available</h3>
        <p className="mt-1 text-sm text-gray-500">Generate a market report to view comprehensive analysis.</p>
        <button
          onClick={onGenerate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Report
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
            <p className="text-gray-600 mt-1">{report.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Generated</div>
            <div className="font-medium text-gray-900">{formatDate(report.generatedAt)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{report.trends.length}</div>
            <div className="text-sm text-blue-700">Trends</div>
          </div>
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-900">{report.insights.length}</div>
            <div className="text-sm text-green-700">Insights</div>
          </div>
          <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-900">{report.opportunities.length}</div>
            <div className="text-sm text-purple-700">Opportunities</div>
          </div>
          <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-2xl font-bold text-orange-900">{Math.round(report.confidence * 100)}%</div>
            <div className="text-sm text-orange-700">Confidence</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Valid until: {formatDate(report.validUntil)}</span>
            <span>Location: {report.location}</span>
          </div>
        </div>
      </div>

      {/* Report Sections */}
      {report.sections.length > 0 && (
        <div className="space-y-4">
          {report.sections.map((section) => (
            <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-gray-600 mt-1">{section.content}</p>
                </div>
                <button
                  onClick={() => setSelectedSection(selectedSection?.id === section.id ? null : section)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {selectedSection?.id === section.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Section Details */}
              {selectedSection?.id === section.id && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-6">
                    {/* Charts */}
                    {section.charts.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Charts</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {section.charts.map((chart) => (
                            <div key={chart.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{chart.title}</h5>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {formatChartType(chart.type)}
                                </span>
                              </div>
                              {chart.description && (
                                <p className="text-sm text-gray-600 mb-3">{chart.description}</p>
                              )}
                              <div className="h-48 bg-white border border-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Chart visualization would appear here</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tables */}
                    {section.tables.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Data Tables</h4>
                        <div className="space-y-4">
                          {section.tables.map((table) => (
                            <div key={table.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                <h5 className="font-medium text-gray-900">{table.title}</h5>
                                {table.description && (
                                  <p className="text-sm text-gray-600 mt-1">{table.description}</p>
                                )}
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      {table.headers.map((header, index) => (
                                        <th
                                          key={index}
                                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {table.rows.map((row, rowIndex) => (
                                      <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                          <td
                                            key={cellIndex}
                                            className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                                          >
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Report Actions</h3>
            <p className="text-sm text-gray-600">Download or share this market report</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              Download PDF
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Share Report
            </button>
            <button
              onClick={onGenerate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
