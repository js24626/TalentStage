import React, { useState, useRef } from 'react';
import { useStore } from '../../store/store';
import { Video, Upload, Play, StopCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './VideoScreening.css';

const VideoScreening = ({ candidate }) => {
  const { updateVideoScreening } = useStore();
  const [mode, setMode] = useState(null); // 'record' or 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [decision, setDecision] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 60000);

    } catch (error) {
      alert('Could not access camera/microphone. Please check permissions.');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleSubmit = () => {
    if (!decision) {
      alert('Please select a decision (Pass/Hold/Reject)');
      return;
    }

    // Simulate AI evaluation
    const screening = {
      status: 'completed',
      submittedDate: new Date().toISOString(),
      transcript: 'Hello, I am very interested in this position. I have 5 years of experience in frontend development with React and TypeScript...',
      scores: {
        communication: Math.floor(Math.random() * 15) + 85,
        clarity: Math.floor(Math.random() * 15) + 80,
        confidence: Math.floor(Math.random() * 15) + 85
      },
      recommendation: decision === 'pass' ? 'Strong Pass' : decision === 'hold' ? 'Hold' : 'Not Recommended',
      videoUrl: recordedVideo || uploadedVideo || '#',
      reviewerDecision: decision,
      reviewerNotes: notes
    };

    updateVideoScreening(candidate.id, screening);
    setSubmitted(true);
  };

  const activeVideo = recordedVideo || uploadedVideo;

  if (submitted) {
    return (
      <div className="video-screening-card">
        <div className="success-state">
          <CheckCircle size={64} />
          <h3>Video Screening Submitted!</h3>
          <p>The candidate's video screening has been processed and evaluated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-screening-card">
      <h3>Video Screening</h3>
      <p className="video-screening-subtitle">
        Record or upload a 30-60 second video response from the candidate
      </p>

      {!mode && (
        <div className="video-mode-select">
          <button 
            className="mode-btn"
            onClick={() => setMode('record')}
          >
            <Video size={32} />
            <span>Record Video</span>
          </button>
          <button 
            className="mode-btn"
            onClick={() => setMode('upload')}
          >
            <Upload size={32} />
            <span>Upload Video</span>
          </button>
        </div>
      )}

      {mode === 'record' && (
        <div className="video-recorder">
          <div className="video-preview-container">
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted={isRecording}
              src={recordedVideo}
              controls={!isRecording && recordedVideo}
              className="video-preview"
            />
            {!isRecording && !recordedVideo && (
              <div className="video-placeholder">
                <Video size={48} />
                <p>Click Start Recording to begin</p>
              </div>
            )}
          </div>

          <div className="recording-controls">
            {!recordedVideo && !isRecording && (
              <button className="btn  btn-lg" onClick={startRecording}>
                <Play size={20} />
                Start Recording
              </button>
            )}
            {isRecording && (
              <>
                <div className="recording-indicator">
                  <div className="recording-dot" />
                  <span>Recording... (Max 60s)</span>
                </div>
                <button className="btn btn-error btn-lg" onClick={stopRecording}>
                  <StopCircle size={20} />
                  Stop Recording
                </button>
              </>
            )}
            {recordedVideo && (
              <>
                <button className="btn btn-secondary" onClick={() => {
                  setRecordedVideo(null);
                  setMode(null);
                }}>
                  Record Again
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <div className="video-uploader">
          {!uploadedVideo ? (
            <div className="upload-area">
              <label htmlFor="video-upload" className="upload-label">
                <Upload size={48} />
                <h4>Upload Video File</h4>
                <p>Click to browse or drag and drop</p>
                <p className="upload-hint">MP4, WebM, MOV (Max 100MB)</p>
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="upload-input"
              />
              <button 
                className="btn btn-secondary" 
                onClick={() => setMode(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="video-preview-container">
                <video 
                  src={uploadedVideo}
                  controls
                  className="video-preview"
                />
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setUploadedVideo(null);
                  setMode(null);
                }}
              >
                Upload Different Video
              </button>
            </>
          )}
        </div>
      )}

      {activeVideo && (
        <div className="video-decision">
          <h4>Review & Decision</h4>
          <div className="decision-buttons">
            <button 
              className={`decision-btn pass ${decision === 'pass' ? 'active' : ''}`}
              onClick={() => setDecision('pass')}
            >
              <CheckCircle size={20} />
              Pass
            </button>
            <button 
              className={`decision-btn hold ${decision === 'hold' ? 'active' : ''}`}
              onClick={() => setDecision('hold')}
            >
              <AlertCircle size={20} />
              Hold
            </button>
            <button 
              className={`decision-btn reject ${decision === 'reject' ? 'active' : ''}`}
              onClick={() => setDecision('reject')}
            >
              <XCircle size={20} />
              Reject
            </button>
          </div>

          <div className="decision-notes">
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any comments or observations..."
              rows="4"
            />
          </div>

          <button 
            className="btn btn-primary btn-lg submit-btn"
            onClick={handleSubmit}
          >
            Submit Screening
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoScreening;