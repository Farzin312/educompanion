let recognition;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_AUDIO') {
    console.log('Starting transcription process...');
    startTranscription();
    sendResponse({ started: true });
    return true;
  } else if (message.type === 'STOP_TRANSCRIPTION') {
    console.log('Stopping transcription process...');
    if (recognition) {
      recognition.stop();
      sendResponse({ stopped: true });
    } else {
      sendResponse({ error: 'No transcription in progress.' });
    }
    return true;
  }
});

function startTranscription() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.continuous = true; // Enable continuous transcription
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('\n');
    console.log('Transcription completed:', transcript);

    chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_RESULT', transcript });
  };

  recognition.onerror = (event) => {
    console.error('Error during transcription:', event.error);
    chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_ERROR', error: event.error });
  };

  recognition.start();
}
