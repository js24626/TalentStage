import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/store';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Mic, Send, Minimize2 } from 'lucide-react';
import AssistantAvatar from './AssistantAvatar';
import './AssistantWidget.css';

const AssistantWidget = () => {
  const { 
    assistantOpen, 
    toggleAssistant, 
    chatMessages, 
    addChatMessage,
    avatarState,
    setAvatarState,
    selectedJobId,
    selectedCandidateId,
    shortlistTopCandidates,
    generateRubric,
    scheduleInterview,
    jobs,
    candidates
  } = useStore();
  
  const [minimized, setMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatMessages]);

  // Initialize with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        role: 'assistant',
        content: 'Hi! I\'m your AI recruitment assistant. I can help you shortlist candidates, generate evaluation rubrics, and schedule interviews. How can I assist you today?'
      });
    }
  }, []);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addChatMessage({
        role: 'assistant',
        content: 'Voice input is not supported in your browser. Please type your message instead.'
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
      setAvatarState('listening');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
      setAvatarState('idle');
      
      // Auto-send the transcribed message after a short delay
      setTimeout(() => {
        if (transcript) {
          handleSendMessage(transcript);
        }
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setAvatarState('idle');
      
      let errorMessage = 'Voice recognition error. ';
      if (event.error === 'no-speech') {
        errorMessage += 'No speech detected. Please try again.';
      } else if (event.error === 'not-allowed') {
        errorMessage += 'Microphone access denied. Please allow microphone permissions.';
      } else {
        errorMessage += 'Please type your message instead.';
      }
      
      addChatMessage({
        role: 'assistant',
        content: errorMessage
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      setAvatarState('idle');
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
      setAvatarState('idle');
      addChatMessage({
        role: 'assistant',
        content: 'Could not start voice recognition. Please type your message.'
      });
    }
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setAvatarState('speaking');
    };

    utterance.onend = () => {
      setAvatarState('idle');
    };

    utterance.onerror = () => {
      setAvatarState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const processCommand = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Shortlist candidates
    if (lowerMessage.includes('shortlist')) {
      if (!selectedJobId) {
        return {
          response: 'Please go to a job detail page first, then I can shortlist candidates for you.',
          needsJob: true
        };
      }
      
      setAvatarState('thinking');
      
      setTimeout(() => {
        const shortlisted = shortlistTopCandidates(selectedJobId);
        const job = jobs.find(j => j.id === selectedJobId);
        
        const response = `✓ Done! I've shortlisted the top candidates for "${job?.title}": ${shortlisted.join(', ')}. They have been moved to the shortlisted stage. You can see the changes in the candidates list.`;
        
        addChatMessage({
          role: 'assistant',
          content: response
        });
        
        setAvatarState('idle');
        speak(response);
      }, 1200);
      
      return { async: true };
    }
    
    // Generate rubric
    if (lowerMessage.includes('rubric')) {
      if (!selectedJobId) {
        return {
          response: 'Please go to a job detail page first, then I can generate an evaluation rubric.',
          needsJob: true
        };
      }
      
      setAvatarState('thinking');
      
      setTimeout(() => {
        const rubric = generateRubric(selectedJobId);
        const job = jobs.find(j => j.id === selectedJobId);
        
        const criteriaList = rubric.map(r => `${r.criteria} (${r.weight}%)`).join(', ');
        const response = `✓ Done! I've generated an evaluation rubric for "${job?.title}" with ${rubric.length} criteria: ${criteriaList}. Click "Edit Rubric" on the job page to review and customize it.`;
        
        addChatMessage({
          role: 'assistant',
          content: response
        });
        
        setAvatarState('idle');
        speak(response);
      }, 1500);
      
      return { async: true };
    }
    
    // Schedule interview
    if (lowerMessage.includes('schedule') || lowerMessage.includes('interview')) {
      if (!selectedCandidateId) {
        return {
          response: 'Please go to a candidate profile page first, then I can schedule an interview.',
          needsCandidate: true
        };
      }
      
      setAvatarState('thinking');
      
      setTimeout(() => {
        scheduleInterview(selectedCandidateId);
        const candidate = candidates.find(c => c.id === selectedCandidateId);
        
        const response = `✓ Done! Interview scheduled for ${candidate?.name}. The event has been added to their activity timeline. You can see it on their profile page.`;
        
        addChatMessage({
          role: 'assistant',
          content: response
        });
        
        setAvatarState('idle');
        speak(response);
      }, 1200);
      
      return { async: true };
    }
    
    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return {
        response: `I can help you with these tasks:\n\n1. Shortlist candidates - I'll analyze scores and move top candidates to shortlisted stage\n2. Generate evaluation rubrics - I'll create criteria based on the job role\n3. Schedule interviews- I'll add interview events to candidate timelines\n\nJust tell me what you'd like to do!`
      };
    }
    
    // Default response
    return {
      response: `I understand you said: "${message}"\n\nI can help you with:\n• Shortlisting candidates\n• Generating evaluation rubrics\n• Scheduling interviews\n\nWhat would you like me to do?`
    };
  };

  const handleSendMessage = (messageText) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    // Add user message
    addChatMessage({
      role: 'user',
      content: textToSend
    });

    setInputValue('');
    setAvatarState('thinking');
    
    // Process command after a short delay
    setTimeout(() => {
      const result = processCommand(textToSend);
      
      if (result.async) {
        // Command is processing asynchronously, response will be added later
        return;
      }
      
      // Add immediate response
      addChatMessage({
        role: 'assistant',
        content: result.response
      });
      
      setAvatarState('idle');
      speak(result.response);
    }, 600);
  };

  const handleSend = () => {
    handleSendMessage(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSuggestedActions = () => {
    const actions = [];
    
    if (location.pathname.startsWith('/jobs/') && selectedJobId) {
      actions.push({
        label: '🎯 Shortlist top candidates',
        action: () => handleSendMessage('Shortlist top candidates')
      });
      actions.push({
        label: '📋 Generate evaluation rubric',
        action: () => handleSendMessage('Generate evaluation rubric')
      });
    }
    
    if (location.pathname.startsWith('/candidates/') && selectedCandidateId) {
      actions.push({
        label: '📅 Schedule interview',
        action: () => handleSendMessage('Schedule interview')
      });
    }
    
    if (actions.length === 0) {
      actions.push({
        label: '❓ What can you help me with?',
        action: () => handleSendMessage('help')
      });
    }
    
    return actions;
  };

  if (!assistantOpen) {
    return (
   <button
      className="assistant-fab"
      onClick={toggleAssistant}
      aria-label="Open chat assistant"
    >
      <img
        src="/images/bot.png"   // 👈 replace with your logo path
        alt="Chat Assistant"
        className="w-10 h-10 object-contain"
      />
    </button>
    );
  }

  return (
    <div className={`assistant-widget ${minimized ? 'minimized' : ''}`}>
      <div className="assistant-header">
        <div className="assistant-header-left">
          <AssistantAvatar state={avatarState} size={32} />
          <div>
            <h4>AI Assistant</h4>
            <p className="assistant-status">
              {avatarState === 'listening' && '🎤 Listening...'}
              {avatarState === 'thinking' && '🤔 Thinking...'}
              {avatarState === 'speaking' && '💬 Speaking...'}
              {avatarState === 'idle' && '✓ Online'}
            </p>
          </div>
        </div>
        <div className="assistant-header-actions">
          <button onClick={() => setMinimized(!minimized)} className="icon-btn" aria-label="Minimize">
            <Minimize2 size={18} />
          </button>
          <button onClick={toggleAssistant} className="icon-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="assistant-messages">
            {chatMessages.map((msg, idx) => (
              <Message key={idx} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="suggested-actions">
            {getSuggestedActions().map((action, idx) => (
              <button 
                key={idx}
                className="suggested-action-btn"
                onClick={action.action}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="assistant-input">
            <button 
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              title="Voice input"
              disabled={isListening}
            >
              <Mic size={20} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Type a message or use voice..."}
              disabled={isListening}
            />
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={!inputValue.trim() || isListening}
            >
              <Send size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Message = ({ message }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        {message.content}
      </div>
      <div className="message-time">
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
};

export default AssistantWidget;