let recognition;

chrome.storage.local.get('isTranscribing', (result) => {
  if (result.isTranscribing) {
    console.log('Resuming transcription...');
    startTranscription();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_AUDIO') {
    if (!recognition) {
      console.log('Starting new transcription...');
      startTranscription();
      sendResponse({ started: true });
    } else {
      console.log('Transcription is already running.');
      sendResponse({ started: true });
    }
    return true;
  } else if (message.type === 'STOP_TRANSCRIPTION') {
    if (recognition) {
      console.log('Stopping transcription...');
      recognition.stop();
      recognition = null;
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
  recognition.continuous = true;
  recognition.interimResults = true; // Enable interim results for live updates
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscripts = [];

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        const finalTranscript = result[0].transcript.trim();
        console.log('Final transcription result received:', finalTranscript);
        finalTranscripts.push(finalTranscript);
        chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_RESULT', transcript: finalTranscript });
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    // Send interim results to the extension popup for live display
    if (interimTranscript) {
      console.log('Interim transcription:', interimTranscript);
      chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_INTERIM_RESULT', transcript: interimTranscript });
    }
  };

  recognition.onerror = (event) => {
    console.error('Error during transcription:', event.error);
    chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_ERROR', error: event.error });
  };

  recognition.onend = () => {
    console.log('Transcription ended.');
    chrome.storage.local.set({ isTranscribing: false });
    chrome.runtime.sendMessage({ type: 'TRANSCRIPTION_ENDED' });
  };

  recognition.start();
  console.log('Transcription started.');
}
