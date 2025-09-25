'use client'

import React, { useState } from 'react'
import { Agent } from '../../types/agent'
import { useAgent } from '../../hooks/useAgent'

interface AgentProfileProps {
  agent: Agent
  onClose: () => void
}

export function AgentProfile({ agent, onClose }: AgentProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'properties' | 'contact'>('overview')
  const { reviews, commissions, clients } = useAgent(agent.id)

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }

    return stars
  }

  const formatSpecialty = (specialty: string) => {
    return specialty.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={agent.profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}`}
                alt={agent.profile.displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h2 className="text-2xl font-bold">{agent.profile.displayName}</h2>
                <p className="text-blue-100">{agent.brokerageName}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {getRatingStars(agent.rating)}
                    </div>
                    <span className="text-sm">
                      {agent.rating.toFixed(1)} ({agent.reviewCount} reviews)
                    </span>
                  </div>
                  <span className="text-sm">•</span>
                  <span className="text-sm">{agent.experience} years experience</span>
                  {agent.isVerified && (
                    <>
                      <span className="text-sm">•</span>
                      <span className="text-sm font-medium">Verified Agent</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'properties', label: 'Properties' },
              { id: 'contact', label: 'Contact' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{agent.profile.bio}</p>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {formatSpecialty(specialty)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {agent.profile.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.profile.languages.map((language) => (
                      <span
                        key={language}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Areas */}
              {agent.profile.serviceAreas.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.profile.serviceAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {agent.profile.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                  <ul className="space-y-2">
                    {agent.profile.certifications.map((cert) => (
                      <li key={cert} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Awards */}
              {agent.profile.awards.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Awards & Recognition</h3>
                  <ul className="space-y-2">
                    {agent.profile.awards.map((award) => (
                      <li key={award} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Performance Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{agent.stats.propertiesSold}</div>
                    <div className="text-sm text-gray-600">Properties Sold</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      ${(agent.stats.totalSalesValue / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{agent.stats.averageDaysOnMarket}</div>
                    <div className="text-sm text-gray-600">Avg Days on Market</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{agent.stats.clientSatisfactionScore}%</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {getRatingStars(review.rating)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{review.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <div className="mt-2 text-sm text-gray-600">
                          Transaction: {review.transactionType} • {review.isVerified ? 'Verified' : 'Unverified'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Listings</h3>
                <p className="text-gray-500 text-center py-8">No current listings available</p>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {agent.profile.phone && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{agent.profile.phone}</span>
                    </div>
                  )}
                  
                  {agent.profile.email && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{agent.profile.email}</span>
                    </div>
                  )}
                  
                  {agent.profile.website && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                      <a href={agent.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {agent.profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter message subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your message here..."
                    />
                  </div>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}