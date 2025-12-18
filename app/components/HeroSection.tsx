'use client';

import { APP_CONFIG } from '../constants';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Headline - strong typography, no gradients */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
          {APP_CONFIG.tagline}
        </h1>

        {/* Subheadline - understated */}
        <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          {APP_CONFIG.description}
        </p>

        {/* CTA - minimal button */}
        <button
          onClick={onGetStarted}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:opacity-60 transition-opacity"
        >
          Start exploring
          <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
        </button>

        {/* Trust indicators - very subtle */}
        <div className="mt-16 flex items-center justify-center gap-8 text-xs text-neutral-400 dark:text-neutral-500">
          <span>Free & open source</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">No account needed</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Your location stays private</span>
        </div>
      </div>
    </section>
  );
}
