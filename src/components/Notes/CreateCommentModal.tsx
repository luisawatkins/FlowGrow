// Create/Edit Comment Modal Component

'use client';

import React, { useState, useEffect } from 'react';
import { PropertyComment, CreateCommentRequest, UpdateCommentRequest } from '@/types/notes';

interface CreateCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCommentRequest | UpdateCommentRequest) => void;
  initialData?: PropertyComment;
  isEditing?: boolean;
}

export const CreateCommentModal: React.FC<CreateCommentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    content: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        content: initialData.content
      });
    } else {
      setFormData({
        content: ''
      });
    }
    setErrors({});
  }, [initialData, isEditing, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Comment content is required';
    }

    if (formData.content.length > 2000) {
      newErrors.content = 'Comment must be less than 2000 characters';
    }

    if (formData.content.length < 10) {
      newErrors.content = 'Comment must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Comment' : 'Add New Comment'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Comment *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Share your thoughts about this property..."
                maxLength={2000}
              />
              <div className="flex justify-between mt-1">
                {errors.content && (
                  <p className="text-sm text-red-600">{errors.content}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {formData.content.length}/2000 characters
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Comment Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be respectful and constructive</li>
                <li>• Share relevant information about the property</li>
                <li>• Avoid personal attacks or spam</li>
                <li>• Comments are moderated before being published</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {isEditing ? 'Update Comment' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
