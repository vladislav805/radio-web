import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { App } from '@components/App';

import './legacy.css';
import './theme.css';

const rootElement = document.getElementById('root');

if (rootElement !== null) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
