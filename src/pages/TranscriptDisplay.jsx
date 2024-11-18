import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { jsPDF } from 'jspdf';

function TranscriptDisplay() {
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load existing transcription state and content from storage
    chrome.storage.local.get(['transcriptions', 'isTranscribing'], (result) => {
      if (result.transcriptions) {
        console.log('Loaded stored transcriptions:', result.transcriptions);
        setTranscript(result.transcriptions.join('\n'));
      }
      setIsTranscribing(result.isTranscribing || false);
    });

    // Listen for messages from content script
    const handleMessage = (message) => {
      console.log('Message received in React component:', message);
      if (message.type === 'TRANSCRIPTION_RESULT') {
        setTranscript((prev) => {
          const newTranscript = prev + '\n' + message.transcript;
          chrome.storage.local.set({ transcriptions: newTranscript.split('\n') });
          return newTranscript;
        });
        setInterimText(''); // Clear interim text when a final result is received
      } else if (message.type === 'TRANSCRIPTION_INTERIM_RESULT') {
        setInterimText(message.transcript);
      } else if (message.type === 'TRANSCRIPTION_ERROR') {
        setError(`Error: ${message.error}`);
        setTimeout(() => setError(''), 5000);
      } else if (message.type === 'TRANSCRIPTION_ENDED') {
        setIsTranscribing(false);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleTranscribe = () => {
    setIsTranscribing(true);
    chrome.storage.local.set({ isTranscribing: true });
    chrome.runtime.sendMessage({ type: 'CAPTURE_AUDIO' }, (response) => {
      if (response?.error) {
        console.error('Error starting transcription:', response.error);
        setError(`Error: ${response.error}`);
        setIsTranscribing(false);
        chrome.storage.local.set({ isTranscribing: false });
      }
    });
  };

  const handleStopTranscribe = () => {
    chrome.runtime.sendMessage({ type: 'STOP_TRANSCRIPTION' }, (response) => {
      if (response?.error) {
        console.error('Error stopping transcription:', response.error);
        setError(`Error: ${response.error}`);
      }
    });
    setIsTranscribing(false);
    chrome.storage.local.set({ isTranscribing: false });
  };

  const handleSaveAsPDF = () => {
    if (isTranscribing) {
      setError('Stop transcription to download.');
      setTimeout(() => setError(''), 3000);
      return;
    }
  
    if (!transcript.trim()) {
      setError('No transcript to save.');
      setTimeout(() => setError(''), 3000);
      return;
    }
  
    try {
      const doc = new jsPDF();
      const splitText = doc.splitTextToSize(transcript, 180); // Split text to fit the page width
      doc.text(splitText, 10, 10); // Add the text with proper formatting
      doc.save('transcription.pdf');
      setNotification('Download successful!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Error generating PDF.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRefreshTranscript = () => {
    setTranscript('');
    chrome.storage.local.remove('transcriptions');
    setNotification('Transcript refreshed successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="w-full h-full p-4">
      <BackButton tooltip="Back to Previous Page" />
      <h1 className="text-2xl font-bold text-center mb-4">Transcription</h1>
      {isTranscribing ? (
        <div className="flex gap-4 justify-center mb-4">
          <p className="text-center text-gray-600">Transcribing... Please wait.</p>
          <button
            onClick={handleStopTranscribe}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
          >
            Stop Transcription
          </button>
        </div>
      ) : (
        <div className='flex justify-center items-center'>
          <button
            onClick={handleTranscribe}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all mb-4"
          >
            Start Transcription
          </button>
        </div>
      )}
      {notification && (
        <div className="mt-2 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
          {notification}
        </div>
      )}
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-800 border border-red-300 rounded">
          {error}
        </div>
      )}
      <textarea
        className="mt-4 p-2 w-full h-64 border border-gray-300 rounded-md bg-gray-100 resize-none"
        value={transcript + (interimText ? '\n' + interimText : '')}
        onChange={(e) => setTranscript(e.target.value)} // Allow user edits
        rows={10}
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSaveAsPDF}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
        >
          Save as PDF
        </button>
        <button
          onClick={handleRefreshTranscript}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-all"
        >
          Refresh Transcript
        </button>
      </div>
    </div>
  );
}

export default TranscriptDisplay;
