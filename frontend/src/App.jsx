import React, { useState } from 'react';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import VoiceRecorder from './components/VoiceRecorder';
import AnswerDisplay from './components/AnswerDisplay';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [jobAdded, setJobAdded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState(null);

  const handleResumeUpload = (id) => {
    setSessionId(id);
    setResumeUploaded(true);
  };

  const handleJobAdded = () => {
    setJobAdded(true);
  };

  const handleTranscription = (text) => {
    setCurrentQuestion(text);
  };

  const handleAnswerGenerated = (answer) => {
    setCurrentAnswer(answer);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎤 Interview Assistant</h1>
        <p>Upload your resume, add job description, then ask questions using your voice</p>
      </header>

      <div className="container">
        {/* Setup Section */}
        <div className="setup-section">
          <h2>1. Upload Your Resume</h2>
          <ResumeUploader onUploadSuccess={handleResumeUpload} />
          {resumeUploaded && (
            <div className="status-badge success">✓ Resume uploaded successfully</div>
          )}
        </div>

        <div className="setup-section">
          <h2>2. Add Job Description</h2>
          <JobDescriptionInput
            sessionId={sessionId}
            onJobAdded={handleJobAdded}
            disabled={!resumeUploaded}
          />
          {jobAdded && (
            <div className="status-badge success">✓ Job description added</div>
          )}
        </div>

        {/* Interview Section */}
        {resumeUploaded && (
          <>
            <div className="setup-section">
              <h2>3. Ask Your Question (Voice)</h2>
              <VoiceRecorder
                sessionId={sessionId}
                onTranscription={handleTranscription}
                onAnswerGenerated={handleAnswerGenerated}
              />
            </div>

            {/* Answer Display */}
            {currentAnswer && (
              <AnswerDisplay
                question={currentQuestion}
                answer={currentAnswer}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
