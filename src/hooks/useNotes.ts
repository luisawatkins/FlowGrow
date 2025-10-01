import { useState, useEffect } from 'react';
import { PropertyNote, NoteFilter, NoteSearchResult, CreateNoteRequest, UpdateNoteRequest } from '../types/notes';
import { NotesService } from '../lib/notesService';

export const useNotes = (propertyId?: string) => {
  const [notes, setNotes] = useState<PropertyNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const propertyNotes = await NotesService.getPropertyNotes(propertyId);
      setNotes(propertyNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (request: CreateNoteRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newNote = await NotesService.createNote(request);
      setNotes(prev => [...prev, newNote]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (request: UpdateNoteRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedNote = await NotesService.updateNote(request);
      setNotes(prev => prev.map(note => note.id === request.id ? updatedNote : note));
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await NotesService.deleteNote(noteId);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [propertyId]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: loadNotes
  };
};

export const useNoteSearch = () => {
  const [searchResult, setSearchResult] = useState<NoteSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNotes = async (filter: NoteFilter, page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await NotesService.searchNotes(filter, page, limit);
      setSearchResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search notes');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchResult,
    loading,
    error,
    searchNotes
  };
};