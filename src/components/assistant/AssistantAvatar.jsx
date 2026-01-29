import React from 'react';
import './AssistantAvatar.css';

const AssistantAvatar = ({ state = 'idle', size = 48 }) => {
  return (
    <div className="assistant-avatar-container" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="assistant-avatar">
        {/* Base circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#avatarGradient)"
          className="avatar-circle"
        />
        
        {/* Pulse ring for listening state */}
        {state === 'listening' && (
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2"
            className="pulse-ring"
          />
        )}
        
        {/* Face elements */}
        <g className={`avatar-face ${state}`}>
          {/* Eyes */}
          <circle 
            cx="35" 
            cy="45" 
            r="3" 
            fill="white"
            className="eye left"
          />
          <circle 
            cx="65" 
            cy="45" 
            r="3" 
            fill="white"
            className="eye right"
          />
          
          {/* Mouth based on state */}
          {state === 'idle' && (
            <path 
              d="M 35 60 Q 50 65 65 60" 
              fill="none" 
              stroke="white" 
              strokeWidth="3"
              strokeLinecap="round"
              className="mouth"
            />
          )}
          
          {state === 'speaking' && (
            <>
              <ellipse 
                cx="50" 
                cy="62" 
                rx="12" 
                ry="8" 
                fill="white"
                className="mouth-speaking"
              />
              <path 
                d="M 42 62 Q 50 58 58 62" 
                fill="none" 
                stroke="#4F46E5" 
                strokeWidth="2"
                className="mouth-wave"
              />
            </>
          )}
          
          {state === 'listening' && (
            <circle 
              cx="50" 
              cy="62" 
              r="3" 
              fill="white"
              className="mouth-listening"
            />
          )}
          
          {state === 'thinking' && (
            <path 
              d="M 35 62 L 65 62" 
              stroke="white" 
              strokeWidth="3"
              strokeLinecap="round"
              className="mouth-thinking"
            />
          )}
        </g>
        
        {/* Sound waves for speaking state */}
        {state === 'speaking' && (
          <g className="sound-waves">
            <path 
              d="M 75 50 Q 80 45 85 50 Q 80 55 75 50" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
              opacity="0.6"
              className="wave wave-1"
            />
            <path 
              d="M 25 50 Q 20 45 15 50 Q 20 55 25 50" 
              fill="none" 
              stroke="white" 
              strokeWidth="2"
              opacity="0.6"
              className="wave wave-2"
            />
          </g>
        )}
        
        {/* Thinking dots */}
        {state === 'thinking' && (
          <g className="thinking-dots">
            <circle cx="35" cy="75" r="2" fill="white" className="dot dot-1" />
            <circle cx="50" cy="75" r="2" fill="white" className="dot dot-2" />
            <circle cx="65" cy="75" r="2" fill="white" className="dot dot-3" />
          </g>
        )}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AssistantAvatar;