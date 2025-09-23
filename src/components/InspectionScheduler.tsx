'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Property } from '@/types'

interface InspectionSchedulerProps {
  property: Property
  onScheduleInspection: (inspection: Inspection) => void
  onUpdateMaintenance: (maintenance: MaintenanceRecord) => void
  className?: string
}

interface Inspection {
  id: string
  propertyId: string
  type: InspectionType
  scheduledDate: string
  inspector: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  description: string
  estimatedDuration: number
  cost?: number
  notes?: string
  reportUrl?: string
}

interface MaintenanceRecord {
  id: string
  propertyId: string
  type: MaintenanceType
  title: string
  description: string
  scheduledDate: string
  completedDate?: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  cost?: number
  notes?: string
  photos?: string[]
  nextDueDate?: string
}

interface ServiceProvider {
  id: string
  name: string
  category: string
  rating: number
  phone: string
  email: string
  specialties: string[]
  availability: string[]
}

type InspectionType = 'general' | 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'pest' | 'roof' | 'safety'
type MaintenanceType = 'cleaning' | 'repair' | 'replacement' | 'upgrade' | 'inspection' | 'landscaping' | 'security' | 'other'

export function InspectionScheduler({
  property,
  onScheduleInspection,
  onUpdateMaintenance,
  className = ''
}: InspectionSchedulerProps) {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [activeTab, setActiveTab] = useState<'inspections' | 'maintenance' | 'providers'>('inspections')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [selectedType, setSelectedType] = useState<'inspection' | 'maintenance'>('inspection')

  const [inspectionForm, setInspectionForm] = useState({
    type: 'general' as InspectionType,
    scheduledDate: '',
    inspector: '',
    priority: 'medium' as Inspection['priority'],
    description: '',
    estimatedDuration: 60,
    cost: 0
  })

  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'repair' as MaintenanceType,
    title: '',
    description: '',
    scheduledDate: '',
    priority: 'medium' as MaintenanceRecord['priority'],
    assignedTo: '',
    cost: 0
  })

  // Mock data initialization
  useEffect(() => {
    const mockInspections: Inspection[] = [
      {
        id: '1',
        propertyId: property.id,
        type: 'general',
        scheduledDate: '2024-02-15',
        inspector: 'John Smith',
        status: 'scheduled',
        priority: 'high',
        description: 'Annual general property inspection',
        estimatedDuration: 120,
        cost: 300
      },
      {
        id: '2',
        propertyId: property.id,
        type: 'electrical',
        scheduledDate: '2024-01-20',
        inspector: 'Mike Johnson',
        status: 'completed',
        priority: 'medium',
        description: 'Electrical system inspection',
        estimatedDuration: 90,
        cost: 250,
        reportUrl: '/reports/electrical-inspection.pdf'
      }
    ]

    const mockMaintenance: MaintenanceRecord[] = [
      {
        id: '1',
        propertyId: property.id,
        type: 'cleaning',
        title: 'Deep Clean',
        description: 'Complete deep cleaning of all rooms',
        scheduledDate: '2024-02-01',
        completedDate: '2024-02-01',
        status: 'completed',
        priority: 'medium',
        assignedTo: 'CleanPro Services',
        cost: 150,
        nextDueDate: '2024-05-01'
      },
      {
        id: '2',
        propertyId: property.id,
        type: 'repair',
        title: 'Fix Leaky Faucet',
        description: 'Kitchen faucet needs repair',
        scheduledDate: '2024-02-10',
        status: 'scheduled',
        priority: 'low',
        assignedTo: 'PlumbRight',
        cost: 75
      }
    ]

    const mockProviders: ServiceProvider[] = [
      {
        id: '1',
        name: 'Home Inspection Pro',
        category: 'inspection',
        rating: 4.8,
        phone: '(555) 123-4567',
        email: 'info@homeinspectionpro.com',
        specialties: ['general', 'electrical', 'plumbing'],
        availability: ['Monday-Friday 8AM-6PM']
      },
      {
        id: '2',
        name: 'FixIt All Services',
        category: 'maintenance',
        rating: 4.6,
        phone: '(555) 987-6543',
        email: 'contact@fixitall.com',
        specialties: ['repair', 'cleaning', 'landscaping'],
        availability: ['Monday-Saturday 7AM-7PM']
      }
    ]

    setInspections(mockInspections)
    setMaintenanceRecords(mockMaintenance)
    setServiceProviders(mockProviders)
  }, [property.id])

  const handleScheduleInspection = () => {
    const newInspection: Inspection = {
      id: Date.now().toString(),
      propertyId: property.id,
      ...inspectionForm,
      status: 'scheduled'
    }

    setInspections(prev => [...prev, newInspection])
    onScheduleInspection(newInspection)
    setShowScheduleModal(false)
    setInspectionForm({
      type: 'general',
      scheduledDate: '',
      inspector: '',
      priority: 'medium',
      description: '',
      estimatedDuration: 60,
      cost: 0
    })
  }

  const handleScheduleMaintenance = () => {
    const newMaintenance: MaintenanceRecord = {
      id: Date.now().toString(),
      propertyId: property.id,
      ...maintenanceForm,
      status: 'scheduled'
    }

    setMaintenanceRecords(prev => [...prev, newMaintenance])
    onUpdateMaintenance(newMaintenance)
    setShowMaintenanceModal(false)
    setMaintenanceForm({
      type: 'repair',
      title: '',
      description: '',
      scheduledDate: '',
      priority: 'medium',
      assignedTo: '',
      cost: 0
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'in-progress': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getInspectionIcon = (type: InspectionType) => {
    switch (type) {
      case 'general': return '🔍'
      case 'electrical': return '⚡'
      case 'plumbing': return '🚰'
      case 'hvac': return '🌡️'
      case 'structural': return '🏗️'
      case 'pest': return '🐛'
      case 'roof': return '🏠'
      case 'safety': return '🛡️'
      default: return '📋'
    }
  }

  const getMaintenanceIcon = (type: MaintenanceType) => {
    switch (type) {
      case 'cleaning': return '🧹'
      case 'repair': return '🔧'
      case 'replacement': return '🔄'
      case 'upgrade': return '⬆️'
      case 'inspection': return '🔍'
      case 'landscaping': return '🌱'
      case 'security': return '🔒'
      case 'other': return '📋'
      default: return '🔧'
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Inspection & Maintenance Tracker
        </CardTitle>
        <CardDescription>
          Schedule inspections and track maintenance for {property.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'inspections', label: 'Inspections', icon: '🔍' },
            { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
            { id: 'providers', label: 'Service Providers', icon: '👥' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Scheduled Inspections</h3>
              <Button onClick={() => {
                setSelectedType('inspection')
                setShowScheduleModal(true)
              }}>
                Schedule Inspection
              </Button>
            </div>

            <div className="space-y-3">
              {inspections.map(inspection => (
                <div key={inspection.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getInspectionIcon(inspection.type)}</span>
                      <div>
                        <h4 className="font-semibold capitalize">{inspection.type} Inspection</h4>
                        <p className="text-sm text-gray-600">{inspection.description}</p>
                        <p className="text-sm text-gray-500">
                          Scheduled: {inspection.scheduledDate} • Inspector: {inspection.inspector}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inspection.status)}`}>
                        {inspection.status.toUpperCase()}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(inspection.priority)}`}>
                        {inspection.priority.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <span>Duration: {inspection.estimatedDuration} min</span>
                      {inspection.cost && <span>Cost: {formatCurrency(inspection.cost)}</span>}
                    </div>
                    {inspection.reportUrl && (
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Maintenance Records</h3>
              <Button onClick={() => {
                setSelectedType('maintenance')
                setShowMaintenanceModal(true)
              }}>
                Schedule Maintenance
              </Button>
            </div>

            <div className="space-y-3">
              {maintenanceRecords.map(maintenance => (
                <div key={maintenance.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMaintenanceIcon(maintenance.type)}</span>
                      <div>
                        <h4 className="font-semibold">{maintenance.title}</h4>
                        <p className="text-sm text-gray-600">{maintenance.description}</p>
                        <p className="text-sm text-gray-500">
                          Scheduled: {maintenance.scheduledDate} • Assigned to: {maintenance.assignedTo}
                        </p>
                        {maintenance.nextDueDate && (
                          <p className="text-sm text-blue-600">
                            Next due: {maintenance.nextDueDate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(maintenance.status)}`}>
                        {maintenance.status.toUpperCase()}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(maintenance.priority)}`}>
                        {maintenance.priority.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      {maintenance.cost && <span>Cost: {formatCurrency(maintenance.cost)}</span>}
                      {maintenance.completedDate && (
                        <span>Completed: {maintenance.completedDate}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Providers Tab */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Providers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceProviders.map(provider => (
                <div key={provider.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{provider.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{provider.category}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">{provider.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{provider.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>{provider.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕒</span>
                      <span>{provider.availability[0]}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Schedule {selectedType === 'inspection' ? 'Inspection' : 'Maintenance'}
              </h3>
              
              {selectedType === 'inspection' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inspection Type
                    </label>
                    <select
                      value={inspectionForm.type}
                      onChange={(e) => setInspectionForm(prev => ({ ...prev, type: e.target.value as InspectionType }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="general">General</option>
                      <option value="electrical">Electrical</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="hvac">HVAC</option>
                      <option value="structural">Structural</option>
                      <option value="pest">Pest</option>
                      <option value="roof">Roof</option>
                      <option value="safety">Safety</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date
                    </label>
                    <Input
                      type="date"
                      value={inspectionForm.scheduledDate}
                      onChange={(e) => setInspectionForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inspector
                    </label>
                    <Input
                      value={inspectionForm.inspector}
                      onChange={(e) => setInspectionForm(prev => ({ ...prev, inspector: e.target.value }))}
                      placeholder="Inspector name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={inspectionForm.priority}
                      onChange={(e) => setInspectionForm(prev => ({ ...prev, priority: e.target.value as Inspection['priority'] }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={inspectionForm.description}
                      onChange={(e) => setInspectionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Inspection description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        value={inspectionForm.estimatedDuration}
                        onChange={(e) => setInspectionForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost
                      </label>
                      <Input
                        type="number"
                        value={inspectionForm.cost}
                        onChange={(e) => setInspectionForm(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Type
                    </label>
                    <select
                      value={maintenanceForm.type}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, type: e.target.value as MaintenanceType }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="cleaning">Cleaning</option>
                      <option value="repair">Repair</option>
                      <option value="replacement">Replacement</option>
                      <option value="upgrade">Upgrade</option>
                      <option value="inspection">Inspection</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <Input
                      value={maintenanceForm.title}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Maintenance title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Input
                      value={maintenanceForm.description}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Maintenance description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date
                    </label>
                    <Input
                      type="date"
                      value={maintenanceForm.scheduledDate}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </label>
                    <Input
                      value={maintenanceForm.assignedTo}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                      placeholder="Service provider or person"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={maintenanceForm.priority}
                        onChange={(e) => setMaintenanceForm(prev => ({ ...prev, priority: e.target.value as MaintenanceRecord['priority'] }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cost
                      </label>
                      <Input
                        type="number"
                        value={maintenanceForm.cost}
                        onChange={(e) => setMaintenanceForm(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowScheduleModal(false)
                    setShowMaintenanceModal(false)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={selectedType === 'inspection' ? handleScheduleInspection : handleScheduleMaintenance}
                  className="flex-1"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
