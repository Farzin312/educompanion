// This script runs in the context of the web page
console.log('EduCompanion content script loaded');

// Example: Extracting the page title and logging it
const pageTitle = document.title;
console.log('Page Title:', pageTitle);

// Example: Highlight all <p> tags on the page
const paragraphs = document.querySelectorAll('p');
paragraphs.forEach(p => {
  p.style.backgroundColor = 'yellow';
});

// Communicate with the background script or popup
chrome.runtime.sendMessage({ action: 'pageTitle', data: pageTitle }, (response) => {
  console.log('Response from background:', response);
});

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'highlightText') {
    document.body.style.backgroundColor = message.color || 'lightblue';
    sendResponse({ status: 'Text highlighted' });
  }
});
