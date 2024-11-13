import React, { useEffect, useState } from 'react';
import './popup.css'; 
import hatIcon from '../assets/graduation-hat.svg';
import { List, ListItem, ListItemButton, ListItemText, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Popup() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000); // Adjust time as needed for animation

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    const userConfirmed = window.confirm("Are you sure you want to close this? Make sure to save your notes before exiting.");
    if (userConfirmed) {
      window.close(); // Closes the popup window
    }
  };

  return (
    <div id="root" className="w-full h-full flex flex-col justify-center items-center bg-white p-4 rounded-lg relative">
      <IconButton
        onClick={handleClose}
        className="absolute top-2 right-2"
        aria-label="close"
        sx={{ backgroundColor: '#f0f0f0', color: '#333', '&:hover': { backgroundColor: '#e0e0e0' } }}
      >
        <CloseIcon />
      </IconButton>
      {showAnimation ? (
        <div className="animation-container flex flex-col justify-center items-center">
          <img
            src={hatIcon}
            alt="Graduation Hat"
            className="animate-throw-hat w-24 mb-3"
          />
          <Typography variant="h6" className="animate-fade-out-text text-gray-700">
            Welcome to EduCompanion
          </Typography>
        </div>
      ) : (
        <div className="options-container w-full mt-6 flex flex-col items-center max-w-xs">
          <Typography variant="h6" className="mb-4 text-gray-800 text-center">
            Choose an Option:
          </Typography>
          <List className="w-full">
            {[
              { text: 'Transcribe Video', emoji: '📝' },
              { text: 'Generate Summary', emoji: '🔍' },
              { text: 'Create Flashcards', emoji: '📚' },
              { text: 'Ask a Question', emoji: '❓' },
            ].map((option, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  className="rounded-lg shadow-md hover:bg-blue-50 transition-all"
                  sx={{ display: 'flex', alignItems: 'center', padding: '12px', animation: 'fadeIn 0.5s ease-out' }}
                >
                  <span className="mr-2">{option.emoji}</span>
                  <ListItemText primary={option.text} className="text-center" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
}

export default Popup;
