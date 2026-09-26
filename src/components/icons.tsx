const base = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2 };

export const LockIcon = () => (
  <svg {...base} aria-hidden strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const UnlockIcon = () => (
  <svg {...base} aria-hidden strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 7.5-2" />
  </svg>
);

export const PartyIcon = () => (
  <svg {...base} aria-hidden strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M16 14.2c2.8.3 5 2.6 5 5.8" />
  </svg>
);

export const ChatIcon = () => (
  <svg {...base} aria-hidden strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z" />
  </svg>
);

export const DiceIcon = () => (
  <svg {...base} aria-hidden strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 21 7v10l-9 5-9-5V7z" />
    <path d="M3 7l9 5 9-5M12 12v10" />
  </svg>
);

export const ChevronIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg {...base} aria-hidden strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);
