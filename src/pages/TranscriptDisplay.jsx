import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { jsPDF } from 'jspdf';

function TranscriptDisplay() {
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('transcriptions', (result) => {
      if (result.transcriptions) {
        setTranscript(result.transcriptions.join('\n'));
      }
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'TRANSCRIPTION_RESULT') {
        setTranscript((prev) => {
          const newTranscript = prev + '\n' + message.transcript;
          chrome.storage.local.set({ transcriptions: newTranscript.split('\n') });
          return newTranscript;
        });
        setIsTranscribing(false);
      }
    });
  }, []);

  const handleTranscribe = () => {
    setIsTranscribing(true);
    chrome.runtime.sendMessage({ type: 'CAPTURE_AUDIO' }, (response) => {
      if (response?.error) {
        console.error('Error starting transcription:', response.error);
        setIsTranscribing(false);
      }
    });
  };

  const handleStopTranscribe = () => {
    chrome.runtime.sendMessage({ type: 'STOP_TRANSCRIPTION' }, (response) => {
      if (response?.error) {
        console.error('Error stopping transcription:', response.error);
      }
    });
    setIsTranscribing(false);
  };

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    doc.text(transcript, 10, 10);
    doc.save('transcription.pdf');
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
        <button
          onClick={handleTranscribe}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all mb-4"
        >
          Start Transcription
        </button>
      )}
      {transcript && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-100">
          <h2 className="text-lg font-semibold mb-2">Transcription Result:</h2>
          <pre className="text-gray-800 whitespace-pre-wrap">{transcript}</pre>
          <button
            onClick={handleSaveAsPDF}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
          >
            Save as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default TranscriptDisplay;
