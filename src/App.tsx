import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';
import MainAppUpdated from '@/components/MainAppUpdated';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<MainAppUpdated />} />
              <Route path="*" element={<MainAppUpdated />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;