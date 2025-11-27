'use client';

import { useState, useEffect } from 'react';
import { FiMoon, FiSun, FiMonitor } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSelector() {
  const { theme, changeTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { id: 'light', name: 'Light', icon: <FiSun className="w-4 h-4" /> },
    { id: 'dark', name: 'Dark', icon: <FiMoon className="w-4 h-4" /> },
    { id: 'system', name: 'System', icon: <FiMonitor className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 rounded-full p-1 vh-50">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => changeTheme(t.id)}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            theme === t.id
              ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
          }`}
          title={t.name}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
