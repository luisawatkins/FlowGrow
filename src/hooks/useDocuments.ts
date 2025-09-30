import { useState, useEffect, useCallback } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export function useDocuments(propertyId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/documents/${propertyId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('propertyId', propertyId);

      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      // Create promise to handle XHR
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
      });

      // Send request
      xhr.open('POST', '/api/documents/upload');
      xhr.send(formData);

      const result = await uploadPromise;
      setUploadProgress(0);
      await fetchDocuments();
      return result;
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadProgress(0);
      throw error;
    }
  };

  const downloadDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'download';

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev =>
        prev.filter(doc => doc.id !== documentId)
      );
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  const renameDocument = async (documentId: string, newName: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename document');
      }

      const updatedDocument = await response.json();
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId ? updatedDocument : doc
        )
      );
    } catch (error) {
      console.error('Error renaming document:', error);
      throw error;
    }
  };

  const shareDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to share document');
      }

      const { shareUrl } = await response.json();
      return shareUrl;
    } catch (error) {
      console.error('Error sharing document:', error);
      throw error;
    }
  };

  return {
    documents,
    isLoading,
    uploadProgress,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    renameDocument,
    shareDocument,
  };
}
