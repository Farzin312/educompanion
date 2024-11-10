// This should be plain JavaScript, not a React component.
console.log('Service Worker is active');

// Add a basic event listener to confirm the background script is working
chrome.runtime.onInstalled.addListener(() => {
  console.log('Service Worker installed.');
});

// Example event listener to handle messages from other parts of your extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  sendResponse({ status: 'OK' });
});
