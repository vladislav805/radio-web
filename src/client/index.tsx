import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { App } from '@components/App';

import './legacy.scss';

const rootElement = document.getElementById('root');

if (rootElement !== null) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(<App />);
}
