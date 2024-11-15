chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_AUDIO' || message.type === 'STOP_TRANSCRIPTION') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        // Inject the content script if it is not already present
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['contentScript.js']
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Error injecting content script:', chrome.runtime.lastError);
            sendResponse({ error: chrome.runtime.lastError.message });
          } else {
            // Send the message to the content script to start transcription
            chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error in response from content script:', chrome.runtime.lastError);
                sendResponse({ error: chrome.runtime.lastError.message });
              } else {
                sendResponse(response);
              }
            });
          }
        });
      } else {
        sendResponse({ error: 'No active tab found.' });
      }
    });

    return true; // Keeps the channel open for async response
  }
});
