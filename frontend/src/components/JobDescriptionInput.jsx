import React, { useState } from 'react';
import axios from 'axios';

function JobDescriptionInput({ sessionId, onJobAdded, disabled }) {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Job description is required');
      return;
    }

    if (!sessionId) {
      setError('Please upload resume first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/job/add', {
        sessionId,
        jobTitle,
        company,
        jobDescription: description
      });

      console.log('Job added:', response.data);
      onJobAdded();
    } catch (err) {
      console.error('Job add error:', err);
      setError(err.response?.data?.message || 'Failed to add job description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Job Title (optional)"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        disabled={disabled}
      />

      <input
        type="text"
        placeholder="Company (optional)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        disabled={disabled}
      />

      <textarea
        placeholder="Paste the job description here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={disabled}
      />

      <button
        onClick={handleSubmit}
        disabled={disabled || loading || !description.trim()}
        style={{ marginTop: '15px' }}
      >
        {loading ? 'Adding...' : 'Add Job Description'}
      </button>

      {error && (
        <div className="status-badge error" style={{ marginTop: '15px', display: 'block' }}>
          {error}
        </div>
      )}

      {disabled && (
        <p style={{ color: '#6b7280', marginTop: '10px', fontSize: '0.9rem' }}>
          Please upload your resume first
        </p>
      )}
    </div>
  );
}

export default JobDescriptionInput;
