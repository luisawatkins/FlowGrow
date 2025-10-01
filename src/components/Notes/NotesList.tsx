import React from 'react';
import { PropertyNote } from '../../types/notes';

interface NotesListProps {
  notes: PropertyNote[];
  onEditNote: (note: PropertyNote) => void;
  onDeleteNote: (noteId: string) => void;
  loading?: boolean;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  onEditNote,
  onDeleteNote,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No notes found. Create your first note to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
            <div className="flex items-center space-x-2">
              <span
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: note.category.color + '20', color: note.category.color }}
              >
                {note.category.name}
              </span>
              <span
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: note.priority.color + '20', color: note.priority.color }}
              >
                {note.priority.name}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-3">{note.content}</p>
          
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              {note.isPrivate ? 'Private' : 'Public'} • 
              Created {note.createdAt.toLocaleDateString()}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => onEditNote(note)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};