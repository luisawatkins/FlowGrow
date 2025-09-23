'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Property } from '@/types'

interface RiskAssessmentProps {
  property: Property
  onRiskAssessmentComplete: (assessment: RiskAssessment) => void
  className?: string
}

interface RiskAssessment {
  id: string
  propertyId: string
  assessmentDate: string
  overallRiskScore: number
  riskLevel: RiskLevel
  riskFactors: RiskFactor[]
  insuranceRecommendations: InsuranceRecommendation[]
  mitigationStrategies: MitigationStrategy[]
  estimatedInsuranceCost: number
  coverageRecommendations: CoverageRecommendation[]
}

interface RiskFactor {
  category: RiskCategory
  factor: string
  riskScore: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  description: string
  probability: number
  potentialLoss: number
  mitigation: string
}

interface InsuranceRecommendation {
  provider: string
  policyType: string
  coverage: number
  deductible: number
  monthlyPremium: number
  rating: number
  features: string[]
  pros: string[]
  cons: string[]
}

interface MitigationStrategy {
  strategy: string
  category: RiskCategory
  cost: number
  effectiveness: number
  implementation: string
  timeline: string
  priority: 'low' | 'medium' | 'high'
}

interface CoverageRecommendation {
  coverageType: string
  recommendedAmount: number
  currentAmount?: number
  importance: 'essential' | 'recommended' | 'optional'
  description: string
  cost: number
}

type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high'
type RiskCategory = 'natural-disasters' | 'crime' | 'fire' | 'flood' | 'structural' | 'liability' | 'market' | 'environmental'

export function RiskAssessment({
  property,
  onRiskAssessmentComplete,
  className = ''
}: RiskAssessmentProps) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showInsuranceModal, setShowInsuranceModal] = useState(false)
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<RiskCategory | 'all'>('all')

  // Mock risk assessment data
  useEffect(() => {
    const mockAssessment: RiskAssessment = {
      id: '1',
      propertyId: property.id,
      assessmentDate: '2024-01-15',
      overallRiskScore: 65,
      riskLevel: 'moderate',
      riskFactors: [
        {
          category: 'natural-disasters',
          factor: 'Earthquake Risk',
          riskScore: 75,
          impact: 'high',
          description: 'Property is located in a moderate earthquake risk zone',
          probability: 0.3,
          potentialLoss: 150000,
          mitigation: 'Install earthquake-resistant features and secure heavy items'
        },
        {
          category: 'fire',
          factor: 'Fire Risk',
          riskScore: 45,
          impact: 'medium',
          description: 'Standard fire risk for residential property',
          probability: 0.1,
          potentialLoss: 200000,
          mitigation: 'Install smoke detectors and fire extinguishers'
        },
        {
          category: 'crime',
          factor: 'Burglary Risk',
          riskScore: 55,
          impact: 'medium',
          description: 'Moderate crime rate in the area',
          probability: 0.15,
          potentialLoss: 25000,
          mitigation: 'Install security system and improve lighting'
        },
        {
          category: 'flood',
          factor: 'Flood Risk',
          riskScore: 30,
          impact: 'low',
          description: 'Low flood risk based on location and elevation',
          probability: 0.05,
          potentialLoss: 100000,
          mitigation: 'Maintain proper drainage and consider flood insurance'
        },
        {
          category: 'structural',
          factor: 'Foundation Issues',
          riskScore: 40,
          impact: 'medium',
          description: 'Property age may indicate potential foundation concerns',
          probability: 0.2,
          potentialLoss: 50000,
          mitigation: 'Regular foundation inspections and maintenance'
        }
      ],
      insuranceRecommendations: [
        {
          provider: 'State Farm',
          policyType: 'Homeowners Insurance',
          coverage: 400000,
          deductible: 1000,
          monthlyPremium: 120,
          rating: 4.5,
          features: ['24/7 claims service', 'Online policy management', 'Multi-policy discounts'],
          pros: ['Excellent customer service', 'Comprehensive coverage', 'Competitive rates'],
          cons: ['Higher deductibles', 'Limited customization']
        },
        {
          provider: 'Allstate',
          policyType: 'Homeowners Insurance',
          coverage: 400000,
          deductible: 1500,
          monthlyPremium: 110,
          rating: 4.3,
          features: ['Mobile app', 'Claims rewards', 'Identity protection'],
          pros: ['Good digital tools', 'Rewards program', 'Flexible payment options'],
          cons: ['Limited agent network', 'Higher claims processing time']
        }
      ],
      mitigationStrategies: [
        {
          strategy: 'Install Security System',
          category: 'crime',
          cost: 500,
          effectiveness: 0.8,
          implementation: 'Professional installation of monitored security system',
          timeline: '1-2 weeks',
          priority: 'high'
        },
        {
          strategy: 'Earthquake Retrofitting',
          category: 'natural-disasters',
          cost: 5000,
          effectiveness: 0.9,
          implementation: 'Structural improvements to resist earthquake damage',
          timeline: '2-4 weeks',
          priority: 'medium'
        },
        {
          strategy: 'Fire Safety Upgrades',
          category: 'fire',
          cost: 300,
          effectiveness: 0.7,
          implementation: 'Install smoke detectors, fire extinguishers, and escape routes',
          timeline: '1 week',
          priority: 'high'
        }
      ],
      estimatedInsuranceCost: 130,
      coverageRecommendations: [
        {
          coverageType: 'Dwelling Coverage',
          recommendedAmount: 400000,
          importance: 'essential',
          description: 'Covers the structure of your home',
          cost: 80
        },
        {
          coverageType: 'Personal Property',
          recommendedAmount: 200000,
          importance: 'essential',
          description: 'Covers your belongings',
          cost: 25
        },
        {
          coverageType: 'Liability Coverage',
          recommendedAmount: 300000,
          importance: 'essential',
          description: 'Protects against lawsuits',
          cost: 15
        },
        {
          coverageType: 'Flood Insurance',
          recommendedAmount: 100000,
          importance: 'recommended',
          description: 'Covers flood damage (not included in standard policies)',
          cost: 45
        },
        {
          coverageType: 'Earthquake Insurance',
          recommendedAmount: 150000,
          importance: 'recommended',
          description: 'Covers earthquake damage',
          cost: 35
        }
      ]
    }

    setAssessment(mockAssessment)
  }, [property.id])

  const filteredRiskFactors = useMemo(() => {
    if (!assessment) return []
    if (selectedRiskCategory === 'all') return assessment.riskFactors
    return assessment.riskFactors.filter(factor => factor.category === selectedRiskCategory)
  }, [assessment, selectedRiskCategory])

  const calculateRiskAssessment = async () => {
    setIsCalculating(true)
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newAssessment: RiskAssessment = {
      id: Date.now().toString(),
      propertyId: property.id,
      assessmentDate: new Date().toISOString().split('T')[0],
      overallRiskScore: Math.floor(Math.random() * 40) + 30, // 30-70 range
      riskLevel: 'moderate',
      riskFactors: [],
      insuranceRecommendations: [],
      mitigationStrategies: [],
      estimatedInsuranceCost: Math.floor(Math.random() * 100) + 100,
      coverageRecommendations: []
    }

    setAssessment(newAssessment)
    onRiskAssessmentComplete(newAssessment)
    setIsCalculating(false)
  }

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'very-high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'essential': return 'text-red-600 bg-red-100'
      case 'recommended': return 'text-yellow-600 bg-yellow-100'
      case 'optional': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getRiskIcon = (category: RiskCategory) => {
    switch (category) {
      case 'natural-disasters': return '🌪️'
      case 'crime': return '🔒'
      case 'fire': return '🔥'
      case 'flood': return '🌊'
      case 'structural': return '🏗️'
      case 'liability': return '⚖️'
      case 'market': return '📈'
      case 'environmental': return '🌱'
      default: return '⚠️'
    }
  }

  const categories: { id: RiskCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Risks', icon: '📊' },
    { id: 'natural-disasters', label: 'Natural Disasters', icon: '🌪️' },
    { id: 'fire', label: 'Fire', icon: '🔥' },
    { id: 'crime', label: 'Crime', icon: '🔒' },
    { id: 'flood', label: 'Flood', icon: '🌊' },
    { id: 'structural', label: 'Structural', icon: '🏗️' },
    { id: 'liability', label: 'Liability', icon: '⚖️' },
    { id: 'market', label: 'Market', icon: '📈' },
    { id: 'environmental', label: 'Environmental', icon: '🌱' }
  ]

  if (!assessment) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Loading risk assessment...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🛡️ Risk Assessment & Insurance
        </CardTitle>
        <CardDescription>
          Assess property risks and get insurance recommendations for {property.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Overall Risk Score</div>
            <div className="text-2xl font-bold text-blue-800">{assessment.overallRiskScore}/100</div>
            <div className={`text-sm px-2 py-1 rounded-full mt-1 inline-block ${getRiskLevelColor(assessment.riskLevel)}`}>
              {assessment.riskLevel.toUpperCase()}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Estimated Insurance Cost</div>
            <div className="text-2xl font-bold text-green-800">
              {formatCurrency(assessment.estimatedInsuranceCost)}/month
            </div>
            <div className="text-sm text-green-600">Based on risk factors</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Risk Factors</div>
            <div className="text-2xl font-bold text-purple-800">{assessment.riskFactors.length}</div>
            <div className="text-sm text-purple-600">Identified risks</div>
          </div>
        </div>

        {/* Risk Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedRiskCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRiskCategory(category.id)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        {/* Risk Factors */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Risk Factors</h3>
          {filteredRiskFactors.map((factor, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getRiskIcon(factor.category)}</span>
                  <div>
                    <h4 className="font-semibold">{factor.factor}</h4>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{factor.riskScore}/100</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(factor.impact)}`}>
                    {factor.impact.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Probability</div>
                  <div className="font-semibold">{Math.round(factor.probability * 100)}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Potential Loss</div>
                  <div className="font-semibold">{formatCurrency(factor.potentialLoss)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Mitigation</div>
                  <div className="font-semibold text-blue-600">{factor.mitigation}</div>
                </div>
                <div>
                  <div className="text-gray-600">Category</div>
                  <div className="font-semibold capitalize">{factor.category.replace('-', ' ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mitigation Strategies */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Mitigation Strategies</h3>
          <div className="space-y-3">
            {assessment.mitigationStrategies.map((strategy, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{strategy.strategy}</h4>
                    <p className="text-sm text-gray-600">{strategy.implementation}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(strategy.cost)}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(strategy.priority)}`}>
                      {strategy.priority.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Effectiveness</div>
                    <div className="font-semibold">{Math.round(strategy.effectiveness * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Timeline</div>
                    <div className="font-semibold">{strategy.timeline}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Category</div>
                    <div className="font-semibold capitalize">{strategy.category.replace('-', ' ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Recommendations */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Insurance Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.insuranceRecommendations.map((recommendation, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{recommendation.provider}</h4>
                    <p className="text-sm text-gray-600">{recommendation.policyType}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(recommendation.monthlyPremium)}/month</div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm">{recommendation.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Coverage: </span>
                    <span>{formatCurrency(recommendation.coverage)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Deductible: </span>
                    <span>{formatCurrency(recommendation.deductible)}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Get Quote
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Compare
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Recommendations */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold">Coverage Recommendations</h3>
          <div className="space-y-3">
            {assessment.coverageRecommendations.map((coverage, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(coverage.importance)}`}>
                    {coverage.importance.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{coverage.coverageType}</div>
                    <div className="text-sm text-gray-600">{coverage.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(coverage.recommendedAmount)}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(coverage.cost)}/month
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={calculateRiskAssessment}
            disabled={isCalculating}
            className="flex-1"
          >
            {isCalculating ? 'Calculating...' : 'Update Risk Assessment'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowInsuranceModal(true)}
            className="flex-1"
          >
            Get Insurance Quotes
          </Button>
        </div>

        {/* Insurance Quotes Modal */}
        {showInsuranceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Get Insurance Quotes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get personalized insurance quotes from multiple providers based on your property's risk assessment.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coverage Type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="homeowners">Homeowners Insurance</option>
                    <option value="rental">Rental Property Insurance</option>
                    <option value="landlord">Landlord Insurance</option>
                    <option value="commercial">Commercial Property Insurance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coverage Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="400000"
                    defaultValue="400000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deductible Preference
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="1000">$1,000 (Higher Premium)</option>
                    <option value="2500">$2,500 (Standard)</option>
                    <option value="5000">$5,000 (Lower Premium)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowInsuranceModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Get Quotes
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
