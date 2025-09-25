import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AgentNetwork } from '../../components/AgentNetwork/AgentNetwork'
import { Agent } from '../../types/agent'

// Mock the hooks
jest.mock('../../hooks/useAgent', () => ({
  useAgentSearch: () => ({
    agents: [],
    isLoading: false,
    error: null,
    searchAgents: jest.fn(),
    findMatchingAgents: jest.fn(),
    clearSearch: jest.fn(),
  }),
}))

describe('AgentNetwork', () => {
  it('renders the main agent network component', () => {
    render(<AgentNetwork />)
    
    expect(screen.getByText('Agent Network')).toBeInTheDocument()
    expect(screen.getByText('Connect with verified real estate professionals')).toBeInTheDocument()
    expect(screen.getByText('Search Agents')).toBeInTheDocument()
    expect(screen.getByText('Find My Agent')).toBeInTheDocument()
    expect(screen.getByText('Brokerages')).toBeInTheDocument()
  })

  it('switches between tabs correctly', () => {
    render(<AgentNetwork />)
    
    const matchingTab = screen.getByText('Find My Agent')
    fireEvent.click(matchingTab)
    
    expect(screen.getByText('Find My Agent')).toHaveClass('border-blue-500', 'text-blue-600')
  })
})