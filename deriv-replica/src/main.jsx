import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@deriv-com/quill-ui';
import '@deriv-com/quill-tokens/dist/quill.css';
import './styles.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme="dark">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
