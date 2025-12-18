/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, MapPin } from 'lucide-react';
import { APP_CONFIG } from '../constants';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-50 bg-neutral-50/95 dark:bg-neutral-950/95 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo - simple text */}
          <a href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <MapPin className="w-5 h-5 text-neutral-900 dark:text-neutral-100" strokeWidth={1.5} />
            <span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              {APP_CONFIG.name}
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href={APP_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              GitHub
            </a>

            {/* Theme Toggle - minimal */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
