import React, { useEffect, useState } from 'react';
import './popup.css'; 
import hatIcon from '../assets/graduation-hat.svg';
import { List, ListItem, ListItemButton, ListItemText, Typography, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

function Popup() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    const userConfirmed = window.confirm("Are you sure you want to close this? Make sure to save your notes before exiting.");
    if (userConfirmed) {
      window.close(); // Closes the popup window
    }
  };

  return (
    <div className="w-full h-full bg-white p-1.5 rounded-lg relative box-border">
      <IconButton
        onClick={handleClose}
        className="absolute"
        aria-label="close"
        sx={{ backgroundColor: '#FFFFFFFF', color: '#333', '&:hover': { backgroundColor: '#e0e0e0' } }}
      >
        <CloseIcon />
      </IconButton>
      {showAnimation ? (
        <div className="animation-container box-border max-w-md">
          <img src={hatIcon} alt="Graduation Hat" className="animate-throw-hat w-24 mb-3" />
          <Typography variant="h6" className="animate-fade-out-text text-gray-700">
            Welcome to EduCompanion
          </Typography>
        </div>
      ) : (
        <Box className="w-full max-w-md flex flex-col items-center justify-center box-border">
          <Typography variant="h6" className="mb-4 text-gray-800 text-center">
            How may I help?
          </Typography>
          <List className="w-full">
            {[
              { text: 'Transcribe Video', emoji: '📝', path: '/TranscriptDisplay' },
              { text: 'Generate Summary', emoji: '🔍', path: '/Summary' },
              { text: 'Create Flashcards', emoji: '📚', path: '/FlashcardGenerator' },
              { text: 'Ask a Question', emoji: '❓', path: '/QABot' },
            ].map((option, index) => (
              <ListItem key={index} disablePadding>
                <Link to={option.path} className="w-full">
                  <ListItemButton
                    className="rounded-lg shadow-md hover:bg-blue-50 transition-all"
                    sx={{ display: 'flex', alignItems: 'center', padding: '12px', animation: 'fadeIn 0.5s ease-out' }}
                  >
                    <span className="mr-2">{option.emoji}</span>
                    <ListItemText primary={option.text} className="text-center" />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
}

export default Popup;
