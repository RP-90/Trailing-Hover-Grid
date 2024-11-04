// src/App.js
import React from 'react';
import HeroSection from './Components/HeroSection';

function App() {
  const title = "Trailing background grid effect";
  const description = (
    <>
      Inspired by{' '}
      <a
        href="https://thisisdash.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline"
      >
        thisisdash.com
      </a>
    </>
  );

  return (
    <div className="App">
      <HeroSection title={title} description={description} />
    </div>
  );
}

export default App;