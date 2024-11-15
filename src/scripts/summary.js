async function sendToGeminiNano(text) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}` // Replace or use a secure way to store the key
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: text
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    displaySummary(data); // Adjust this based on the actual response structure
  } catch (error) {
    console.error('Error fetching summary:', error);
  }
}

function displaySummary(summary) {
  // Display the summarized content in the extension
  console.log('Summary:', summary);
}
