import React, { useState, useRef } from 'react';
import axios from 'axios';

function VoiceRecorder({ sessionId, onTranscription, onAnswerGenerated }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscription('');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create MediaRecorder with appropriate MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        // Process the recorded audio
        await processRecording();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log('Recording started...');
    } catch (err) {
      console.error('Microphone access error:', err);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  const processRecording = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      console.log('Audio blob size:', audioBlob.size, 'bytes');

      if (audioBlob.size < 1000) {
        throw new Error('Recording too short. Please speak your question clearly.');
      }

      // Convert to WAV for better compatibility with Whisper
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

      // Step 1: Transcribe audio
      console.log('Transcribing audio...');
      const formData = new FormData();
      formData.append('audio', audioFile);

      const transcriptionResponse = await axios.post('/api/speech/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const transcribedText = transcriptionResponse.data.transcription;
      console.log('Transcription:', transcribedText);

      setTranscription(transcribedText);
      onTranscription(transcribedText);

      // Step 2: Generate answer
      console.log('Generating answer...');
      const answerResponse = await axios.post('/api/answer/generate', {
        sessionId,
        question: transcribedText
      });

      console.log('Answer generated:', answerResponse.data);
      onAnswerGenerated(answerResponse.data);

    } catch (err) {
      console.error('Processing error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to process recording');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voice-recorder">
      <h3 style={{ marginBottom: '20px' }}>
        {isRecording ? '🎙️ Recording...' : '🎤 Ready to record'}
      </h3>

      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="loading" />
        ) : isRecording ? (
          '⏸️'
        ) : (
          '🎙️'
        )}
      </button>

      <p style={{ fontSize: '1rem', marginTop: '20px' }}>
        {isRecording
          ? 'Click to stop recording'
          : isProcessing
          ? 'Processing your question...'
          : 'Click to start recording your question'}
      </p>

      {transcription && (
        <div className="transcription-box">
          <strong>Your Question:</strong>
          <p style={{ marginTop: '10px' }}>{transcription}</p>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '20px'
        }}>
          {error}
        </div>
      )}

      <div className="info-card">
        <p><strong>Tips:</strong></p>
        <p>• Speak clearly and at a normal pace</p>
        <p>• Ask one question at a time</p>
        <p>• Wait a few seconds after your question before stopping</p>
      </div>
    </div>
  );
}

export default VoiceRecorder;
