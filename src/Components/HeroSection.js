// HeroSection.jsx
import React from 'react';
import HoverGrid from './HoverGrid';

function HeroSection({ title, description }) {
  return (
    <div className="relative min-h-screen h-full bg-neutral-950 flex justify-center content-center flex-wrap">
      {/* Canvas Background */}
      <HoverGrid />

      {/* Content Overlay */}
      <div className="relative pointer-events-none h-full inset-0 flex flex-col items-start justify-center p-8 mx-auto w-full max-w-7xl">
        <div className="w-full max-w-screen-2xl px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-extrabold text-center leading-none md:text-5xl xl:text-6xl text-white">
              {title}
            </h1>
            <p className="mt-6 text-lg text-white text-center lg:mb-8 lg:text-xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;