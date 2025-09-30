// Property Notes Hook

import { useState, useEffect, useCallback } from 'react';
import { 
  PropertyNote, 
  CreateNoteRequest, 
  UpdateNoteRequest, 
  NotesFilter,
  UseNotesReturn,
  NotesError 
} from '@/types/notes';
import { notesService } from '@/lib/notesService';

export const useNotes = (propertyId?: string, filter?: NotesFilter): UseNotesReturn => {
  const [notes, setNotes] = useState<PropertyNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NotesError | null>(null);

  const loadNotes = useCallback(async () => {
    if (!propertyId) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await notesService.getNotesByProperty(propertyId, filter);
      setNotes(fetchedNotes);
    } catch (err) {
      setError(err as NotesError);
    } finally {
      setLoading(false);
    }
  }, [propertyId, filter]);

  const createNote = useCallback(async (request: CreateNoteRequest): Promise<PropertyNote> => {
    try {
      setError(null);
      const newNote = await notesService.createNote(request);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (id: string, request: UpdateNoteRequest): Promise<PropertyNote> => {
    try {
      setError(null);
      const updatedNote = await notesService.updateNote(id, request);
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      return updatedNote;
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await notesService.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const getNote = useCallback(async (id: string): Promise<PropertyNote> => {
    try {
      setError(null);
      return await notesService.getNote(id);
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const getNotesByProperty = useCallback(async (propertyId: string, filter?: NotesFilter): Promise<PropertyNote[]> => {
    try {
      setError(null);
      return await notesService.getNotesByProperty(propertyId, filter);
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const searchNotes = useCallback(async (query: string, filter?: NotesFilter): Promise<PropertyNote[]> => {
    try {
      setError(null);
      return await notesService.searchNotes(query, filter);
    } catch (err) {
      setError(err as NotesError);
      throw err;
    }
  }, []);

  const refreshNotes = useCallback(async (): Promise<void> => {
    await loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    getNotesByProperty,
    searchNotes,
    refreshNotes
  };
};
