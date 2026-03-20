import React from 'react';

const TopNavbar = () => {
  return (
    <div className="bg-primary text-secondary h-10 flex items-center justify-center text-xs font-normal gap-6 tracking-wider">
      <button className="text-muted hover:text-white transition-colors cursor-pointer">&lt;</button>
      <span className="font-sans">Minimal never felt better — 20% off now</span>
      <button className="text-muted hover:text-white transition-colors cursor-pointer">&gt;</button>
    </div>
  );
};

export default TopNavbar;
