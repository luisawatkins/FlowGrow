import { useState, useEffect, useCallback } from 'react';

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

interface SchedulingParams {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export function useScheduling(propertyId: string, agentId: string) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAvailableSlots = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/scheduling/available-slots?propertyId=${propertyId}&agentId=${agentId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }
      
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, agentId]);

  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  const scheduleViewing = async (params: SchedulingParams) => {
    try {
      const response = await fetch('/api/scheduling/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          agentId,
          ...params,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule viewing');
      }

      const data = await response.json();
      
      // Update available slots
      setAvailableSlots(prev =>
        prev.map(slot =>
          slot.date === params.date && slot.time === params.time
            ? { ...slot, available: false }
            : slot
        )
      );

      return data;
    } catch (error) {
      console.error('Error scheduling viewing:', error);
      throw error;
    }
  };

  const cancelViewing = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/scheduling/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel viewing');
      }

      // Refresh available slots
      await fetchAvailableSlots();
    } catch (error) {
      console.error('Error canceling viewing:', error);
      throw error;
    }
  };

  const rescheduleViewing = async (
    appointmentId: string,
    newDate: string,
    newTime: string
  ) => {
    try {
      const response = await fetch(`/api/scheduling/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: newDate,
          time: newTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reschedule viewing');
      }

      // Refresh available slots
      await fetchAvailableSlots();
    } catch (error) {
      console.error('Error rescheduling viewing:', error);
      throw error;
    }
  };

  return {
    availableSlots,
    isLoading,
    scheduleViewing,
    cancelViewing,
    rescheduleViewing,
  };
}
