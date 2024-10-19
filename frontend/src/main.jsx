import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Flatpickr CSS and JS
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_green.css';

import flatpickr from 'flatpickr';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/TODO-WEBSITE/',
    element: <App></App>,
    children: [
      { path: '/TODO-WEBSITE/Today', element: <Today></Today> },
      { path: '/TODO-WEBSITE/Upcoming', element: <Upcoming></Upcoming> },
      { path: '/TODO-WEBSITE/Completed', element: <Completed></Completed> },
      { path: '/TODO-WEBSITE/Missed', element: <Missed></Missed> },
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);