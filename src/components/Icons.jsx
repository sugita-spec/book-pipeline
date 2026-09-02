const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v6h-6" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 19v2h16v-2" /></>,
  external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M19 13v7H4V5h7" /></>,
  phone: <path d="M7.4 3.7 10 8 7.7 10a15 15 0 0 0 6.3 6.3l2-2.3 4.3 2.6-.8 3.3c-.2.8-1 1.3-1.8 1.2C9.9 20 4 14.1 2.9 6.3c-.1-.8.4-1.6 1.2-1.8l3.3-.8Z" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.7 2.7L16.5 9" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><path d="M12 7h.01" /></>,
  arrow: <><path d="M8 7h9" /><path d="m14 4 3 3-3 3" /></>,
  facebook: <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v6h4v-6h3.5l.5-4h-4V9c0-.7.3-1 1-1Z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
}

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    >
      {paths[name]}
    </svg>
  )
}
