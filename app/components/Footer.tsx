'use client';

import { APP_CONFIG } from '../constants';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-500">
          <p>
            {APP_CONFIG.name} · Built with Next.js, OpenStreetMap
          </p>
          <div className="flex items-center gap-4">
            <a
              href={APP_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.openstreetmap.org/about"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              OSM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
