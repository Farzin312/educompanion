chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_AUDIO') {
    chrome.storage.local.set({ isTranscribing: true });
    startTranscriptionOnTab(sendResponse);
    return true; // Keep the channel open for async response
  } else if (message.type === 'STOP_TRANSCRIPTION') {
    chrome.storage.local.set({ isTranscribing: false });
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (isValidURL(tab.url)) {
          chrome.tabs.sendMessage(tab.id, { type: 'STOP_TRANSCRIPTION' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error stopping transcription:', chrome.runtime.lastError);
            }
          });
        }
      });
    });
    sendResponse({ stopped: true });
    return true; // Keep the channel open for async response
  }
});

function startTranscriptionOnTab(sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (isValidURL(tab.url)) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js']
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error injecting content script:', chrome.runtime.lastError);
            sendResponse({ error: chrome.runtime.lastError.message });
          } else {
            chrome.tabs.sendMessage(tab.id, { type: 'CAPTURE_AUDIO' }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError);
                sendResponse({ error: chrome.runtime.lastError.message });
              } else {
                sendResponse(response);
              }
            });
          }
        });
      } else {
        console.log(`Skipped injection on non-valid URL: ${tab.url}`);
      }
    });
  });
}

function isValidURL(url) {
  return url && url.startsWith('http') && !url.startsWith('chrome://');
}
