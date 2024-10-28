import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './Page/MainLayout.js'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainLayout>

        </MainLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
