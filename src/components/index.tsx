import React from 'react';
import { createRoot } from "react-dom/client";
import { App } from './App'

// Render your React component instead
const appRoot = document.getElementById("app");
if(appRoot) {
    const root = createRoot(appRoot);
    root.render(<App />);
}

