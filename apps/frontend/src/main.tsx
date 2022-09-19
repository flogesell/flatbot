/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-query-selector */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/index.scss';
import Providers from './Providers';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);
