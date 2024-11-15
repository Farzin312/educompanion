import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Popup from './popup/Popup';
import FlashcardGenerator from './pages/FlashcardGenerator';
import QABot from './pages/QABot';
import TranscriptDisplay from './pages/TranscriptDisplay';
import Summary from './pages/Summary';
import './popup/popup.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter> {/* Attempting to add routes to the home page */}
      <Routes>
        <Route path='/' element={ <Popup />} />
        <Route path='/FlashcardGenerator' element={ <FlashcardGenerator /> } />
        <Route path='/QABot' element={ <QABot />} />
        <Route path='/TranscriptDisplay' element={ <TranscriptDisplay /> } />
        <Route path='/Summary' element={ <Summary /> } />
      </Routes>
      </HashRouter >
  </React.StrictMode>
);
