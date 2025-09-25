'use client'

import React, { useState } from 'react'
import { AgentMatchingCriteria } from '../../types/agent'

interface AgentMatchingProps {
  onMatch: (criteria: AgentMatchingCriteria) => void
}

export function AgentMatching({ onMatch }: AgentMatchingProps) {
  const [criteria, setCriteria] = useState<AgentMatchingCriteria>({
    timeline: 'flexible',
    experience: 'experienced',
    communication: 'email',
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const propertyTypes = [
    { value: 'condo', label: 'Condo' },
    { value: 'house', label: 'Single Family House' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'luxury', label: 'Luxury Home' },
    { value: 'investment', label: 'Investment Property' },
  ]

  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      onMatch(criteria)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onMatch(criteria)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">What type of property are you looking for?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {propertyTypes.map((type) => (
                  <label key={type.value} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="propertyType"
                      value={type.value}
                      checked={criteria.propertyType === type.value}
                      onChange={(e) => setCriteria(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-900">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">What's your budget range?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Price</label>
                  <input
                    type="number"
                    placeholder="e.g., 300000"
                    value={criteria.priceRange?.min || ''}
                    onChange={(e) => setCriteria(prev => ({
                      ...prev,
                      priceRange: {
                        min: parseInt(e.target.value) || 0,
                        max: prev.priceRange?.max || 1000000,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Price</label>
                  <input
                    type="number"
                    placeholder="e.g., 800000"
                    value={criteria.priceRange?.max || ''}
                    onChange={(e) => setCriteria(prev => ({
                      ...prev,
                      priceRange: {
                        min: prev.priceRange?.min || 0,
                        max: parseInt(e.target.value) || 1000000,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Where are you looking to buy/sell?</h3>
              <input
                type="text"
                placeholder="Enter city, state, or zip code"
                value={criteria.location || ''}
                onChange={(e) => setCriteria(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">What's your timeline?</h3>
              <div className="space-y-3">
                {[
                  { value: 'urgent', label: 'Urgent (within 30 days)', description: 'Need to move quickly' },
                  { value: 'flexible', label: 'Flexible (1-6 months)', description: 'No rush, looking for the right fit' },
                  { value: 'planning', label: 'Planning ahead (6+ months)', description: 'Just starting to explore options' },
                ].map((option) => (
                  <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="timeline"
                      value={option.value}
                      checked={criteria.timeline === option.value}
                      onChange={(e) => setCriteria(prev => ({ ...prev, timeline: e.target.value as any }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">What's your experience level?</h3>
              <div className="space-y-3">
                {[
                  { value: 'first_time', label: 'First-time buyer/seller', description: 'New to the process' },
                  { value: 'experienced', label: 'Experienced', description: 'Have bought/sold before' },
                  { value: 'investor', label: 'Real estate investor', description: 'Looking for investment opportunities' },
                ].map((option) => (
                  <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="experience"
                      value={option.value}
                      checked={criteria.experience === option.value}
                      onChange={(e) => setCriteria(prev => ({ ...prev, experience: e.target.value as any }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">How do you prefer to communicate?</h3>
              <div className="space-y-3">
                {[
                  { value: 'email', label: 'Email', description: 'Send me updates via email' },
                  { value: 'phone', label: 'Phone calls', description: 'I prefer to talk on the phone' },
                  { value: 'in_person', label: 'In-person meetings', description: 'Face-to-face communication' },
                ].map((option) => (
                  <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="communication"
                      value={option.value}
                      checked={criteria.communication === option.value}
                      onChange={(e) => setCriteria(prev => ({ ...prev, communication: e.target.value as any }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">What languages do you speak? (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <label key={language} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={criteria.languages?.includes(language) || false}
                      onChange={(e) => setCriteria(prev => ({
                        ...prev,
                        languages: e.target.checked
                          ? [...(prev.languages || []), language]
                          : (prev.languages || []).filter(l => l !== language),
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">{language}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                currentStep === 1
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              Previous
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentStep === totalSteps ? 'Find My Agent' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
