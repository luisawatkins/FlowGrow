import { useState, useEffect, useCallback } from 'react';
import { insuranceService } from '@/lib/insuranceService';

export const useInsurance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Policy Management
  const createPolicy = useCallback(async (policy: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const policyID = await insuranceService.createPolicy(policy);
      return policyID;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create policy';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePolicy = useCallback(async (policyID: string, updates: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await insuranceService.updatePolicy(policyID, updates);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update policy';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPolicies = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const policies = await insuranceService.getPolicies(filters);
      return policies;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get policies';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Claims Management
  const submitClaim = useCallback(async (claim: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const claimID = await insuranceService.submitClaim(claim);
      return claimID;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit claim';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getClaims = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const claims = await insuranceService.getClaims(filters);
      return claims;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get claims';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Risk Assessment
  const assessRisk = useCallback(async (propertyID: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const assessment = await insuranceService.assessRisk(propertyID);
      return assessment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assess risk';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRiskAssessment = useCallback(async (propertyID: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const assessment = await insuranceService.getRiskAssessment(propertyID);
      return assessment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get risk assessment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Provider Management
  const getProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const providers = await insuranceService.getProviders();
      return providers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get providers';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Quote Management
  const generateQuote = useCallback(async (propertyID: number, policyType: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const quotes = await insuranceService.generateQuote(propertyID, policyType);
      return quotes;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quotes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Metrics
  const getMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const metrics = await insuranceService.getMetrics();
      return metrics;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get metrics';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Configuration
  const getConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const config = await insuranceService.getConfig();
      return config;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get config';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (configUpdate: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await insuranceService.updateConfig(configUpdate);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update config';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Event Management
  const subscribeToEvents = useCallback((callback: (event: any) => void) => {
    insuranceService.subscribeToEvents(callback);
  }, []);

  const acknowledgeEvent = useCallback(async (eventID: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await insuranceService.acknowledgeEvent(eventID);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to acknowledge event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEvents = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const events = await insuranceService.getEvents(filters);
      return events;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get events';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    
    // Policy Management
    createPolicy,
    updatePolicy,
    getPolicies,
    
    // Claims Management
    submitClaim,
    getClaims,
    
    // Risk Assessment
    assessRisk,
    getRiskAssessment,
    
    // Provider Management
    getProviders,
    
    // Quote Management
    generateQuote,
    
    // Metrics
    getMetrics,
    
    // Configuration
    getConfig,
    updateConfig,
    
    // Event Management
    subscribeToEvents,
    acknowledgeEvent,
    getEvents
  };
};
