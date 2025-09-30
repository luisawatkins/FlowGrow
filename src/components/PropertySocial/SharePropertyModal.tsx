'use client';

import React, { useState } from 'react';
import { ShareType, ShareMethod } from '@/types/social';
import { Button } from '../ui/Button';

interface SharePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (shareData: any) => void;
  propertyId: string;
}

export function SharePropertyModal({ 
  isOpen, 
  onClose, 
  onShare, 
  propertyId 
}: SharePropertyModalProps) {
  const [shareType, setShareType] = useState<ShareType>(ShareType.DIRECT);
  const [shareMethod, setShareMethod] = useState<ShareMethod>(ShareMethod.EMAIL);
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEmail = () => {
    if (emailInput.trim() && !sharedWith.includes(emailInput.trim())) {
      setSharedWith([...sharedWith, emailInput.trim()]);
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setSharedWith(sharedWith.filter(e => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const shareData = {
        propertyId,
        shareType,
        shareMethod,
        sharedWith,
        message: message.trim() || undefined,
        isPublic,
        allowComments,
        allowReactions,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      };

      await onShare(shareData);
      
      // Reset form
      setShareType(ShareType.DIRECT);
      setShareMethod(ShareMethod.EMAIL);
      setSharedWith([]);
      setMessage('');
      setIsPublic(false);
      setAllowComments(true);
      setAllowReactions(true);
      setExpiresAt('');
      setEmailInput('');
    } catch (error) {
      console.error('Failed to share property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Share Property
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Share this property with others and let them know what you think.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Share Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Type
                  </label>
                  <select
                    value={shareType}
                    onChange={(e) => setShareType(e.target.value as ShareType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ShareType.DIRECT}>Direct Share</option>
                    <option value={ShareType.PUBLIC}>Public Share</option>
                    <option value={ShareType.PRIVATE}>Private Share</option>
                    <option value={ShareType.TEMPORARY}>Temporary Share</option>
                  </select>
                </div>

                {/* Share Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Method
                  </label>
                  <select
                    value={shareMethod}
                    onChange={(e) => setShareMethod(e.target.value as ShareMethod)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={ShareMethod.EMAIL}>Email</option>
                    <option value={ShareMethod.SMS}>SMS</option>
                    <option value={ShareMethod.SOCIAL_MEDIA}>Social Media</option>
                    <option value={ShareMethod.LINK}>Link</option>
                    <option value={ShareMethod.QR_CODE}>QR Code</option>
                    <option value={ShareMethod.DIRECT_MESSAGE}>Direct Message</option>
                  </select>
                </div>

                {/* Recipients (for direct shares) */}
                {shareType === ShareType.DIRECT && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipients
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter email address"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                      />
                      <Button
                        type="button"
                        onClick={handleAddEmail}
                        disabled={!emailInput.trim()}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                    {sharedWith.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {sharedWith.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(email)}
                              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                            >
                              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                                <path d="m0 0 1 1 3-3 3 3 1-1-3-3 3-3-1-1-3 3-3-3z"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Expiration (for temporary shares) */}
                {shareType === ShareType.TEMPORARY && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expires At
                    </label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Privacy Options */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                      Make this share public
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowComments"
                      checked={allowComments}
                      onChange={(e) => setAllowComments(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowComments" className="ml-2 block text-sm text-gray-900">
                      Allow comments
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowReactions"
                      checked={allowReactions}
                      onChange={(e) => setAllowReactions(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowReactions" className="ml-2 block text-sm text-gray-900">
                      Allow reactions
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                disabled={isLoading || (shareType === ShareType.DIRECT && sharedWith.length === 0)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sharing...
                  </>
                ) : (
                  'Share Property'
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
