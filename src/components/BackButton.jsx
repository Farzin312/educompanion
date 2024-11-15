import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BackButton({ to = null, tooltip = 'Go Back' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); 
    }
  };

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={handleClick}
        className="text-blue-600 hover:bg-blue-50 transition-all p-2 rounded-md"
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
}

export default BackButton;
