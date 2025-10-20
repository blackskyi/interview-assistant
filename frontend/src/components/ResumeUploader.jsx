import React, { useState } from 'react';
import axios from 'axios';

function ResumeUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload response:', response.data);
      onUploadSuccess(response.data.sessionId);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="file-upload">
        <input
          type="file"
          id="resume-upload"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <label htmlFor="resume-upload" className="upload-label">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            {file ? (
              <p><strong>{file.name}</strong></p>
            ) : (
              <>
                <p><strong>Click to upload resume (PDF)</strong></p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '5px' }}>
                  or drag and drop your PDF file here
                </p>
              </>
            )}
          </div>
        </label>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{ marginTop: '15px' }}
        >
          {uploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      )}

      {error && (
        <div className="status-badge error" style={{ marginTop: '15px', display: 'block' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default ResumeUploader;
