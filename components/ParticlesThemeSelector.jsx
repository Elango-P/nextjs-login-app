'use client';

import { useState, useEffect, useRef } from 'react';

export const PARTICLES_THEMES = [
  { id: 'default', name: 'Default', emoji: '✨' },
  { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖' },
  { id: 'matrix', name: 'Matrix', emoji: '💻' },
  { id: 'fireflies', name: 'Fireflies', emoji: '✨' },
  { id: 'snow', name: 'Snow', emoji: '❄️' },
  { id: 'rain', name: 'Rain', emoji: '🌧️' },
  { id: 'galaxy', name: 'Galaxy', emoji: '🌌' },
  { id: 'glass', name: 'Glass', emoji: '🔮' },
  { id: 'minimal', name: 'Minimal', emoji: '⚪' },
  { id: 'bubbles', name: 'Bubbles', emoji: '🫧' },
  { id: 'confetti', name: 'Confetti', emoji: '🎉' },
  { id: 'neonRings', name: 'Neon Rings', emoji: '💫' },
  { id: 'aurora', name: 'Aurora', emoji: '🌈' },
  { id: 'holoGrid', name: 'Holo Grid', emoji: '🟦' },
  { id: 'sparkTrails', name: 'Spark Trails', emoji: '⚡' },
  { id: 'energyPulse', name: 'Energy Pulse', emoji: '🔴' },
  { id: 'lavaLamp', name: 'Lava Lamp', emoji: '🟠' },
  { id: 'cosmicDust', name: 'Cosmic Dust', emoji: '🌌' },
  { id: 'starWarp', name: 'Star Warp', emoji: '🚀' },
  { id: 'diamondSpark', name: 'Diamond Spark', emoji: '💎' },
  { id: 'oceanWaves', name: 'Ocean Waves', emoji: '🌊' },
  { id: 'lightning', name: 'Lightning', emoji: '⚡' },
  { id: 'auroraLights', name: 'Aurora Lights', emoji: '🌌' },
  { id: 'autumnLeaves', name: 'Autumn Leaves', emoji: '🍁' },
  { id: 'bubbleRise', name: 'Bubble Rise', emoji: '🫧' },
  { id: 'starfieldWarp', name: 'Starfield Warp', emoji: '⭐' },
  { id: 'magicOrbs', name: 'Magic Orbs', emoji: '🔮' },
  { id: 'fireworkBurst', name: 'Firework Burst', emoji: '🎆' },
  // Add more if needed
];

export default function ParticlesThemeSelector({ onThemeChange }) {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('particlesTheme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      if (onThemeChange) onThemeChange(savedTheme);
    }
  }, [onThemeChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    localStorage.setItem('particlesTheme', themeId);
    if (onThemeChange) onThemeChange(themeId);
    setIsOpen(false);
  };

  const selectedThemeData = PARTICLES_THEMES.find(t => t.id === selectedTheme) || PARTICLES_THEMES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <span className="mr-2">{selectedThemeData.emoji}</span>
            {selectedThemeData.name}
          </span>
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

     {isOpen && (
  <div className="origin-top-right absolute right-0 mt-2 w-48  overflow-y-scroll rounded-md h-[50vh] shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
    <div className="py-1">
      {PARTICLES_THEMES.map((theme) => (
        <button
          key={theme.id}
          className={`flex items-center w-full px-4 py-1 text-sm text-left ${
            selectedTheme === theme.id 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleThemeChange(theme.id)}
        >
          <span className="mr-2 w-6">{theme.emoji}</span>
          {theme.name}
        </button>
      ))}
    </div>
  </div>
)}

    </div>
  );
}
