/**
 * Inline SVG icon set. Small, monochrome, and tinted via `currentColor`.
 * Keeps us font-free and dependency-free.
 */

const paths = {
  snowflake: (
    <>
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
      <path d="M12 5l-2-2M12 5l2-2M12 19l-2 2M12 19l2 2M5 12l-2-2M5 12l-2 2M19 12l2-2M19 12l2 2" />
    </>
  ),
  flame: (
    <path d="M12 2c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2.5 1.5-4 1.5-7 0 0 2 1 2 3 .5-2 1.5-4 1.5-6z" />
  ),
  wrench: (
    <path d="M14 6a4 4 0 1 1 4 4l-9 9-3 1 1-3 9-9z" />
  ),
  shield: (
    <>
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  thermostat: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v9a4 4 0 1 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M12 8v6" />
    </>
  ),
  air: (
    <>
      <path d="M3 8h12a3 3 0 1 0-3-3" />
      <path d="M3 12h17a3 3 0 1 1-3 3" />
      <path d="M3 16h9a3 3 0 1 0-3 3" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
  arrowRight: <path d="M5 12h14M13 5l7 7-7 7" />,
  arrowLeft: <path d="M19 12H5M11 5l-7 7 7 7" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  star: (
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" />
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  map: (
    <>
      <path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13z" />
      <circle cx="12" cy="9" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  facebook: (
    <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </>
  ),
  google: (
    <path d="M21 11h-9v2.6h5.4c-.6 2.7-2.9 4.4-5.4 4.4a6 6 0 1 1 0-12c1.6 0 3 .6 4 1.6L18 5.5A9 9 0 1 0 21 12.2c0-.4 0-.8-.1-1.2z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  hub: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  spark: (
    <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
  ),
  badge: (
    <>
      <path d="M12 2l3 3 4-1 1 4 3 3-3 3-1 4-4-1-3 3-3-3-4 1-1-4-3-3 3-3 1-4 4 1 3-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  leaf: (
    <path d="M5 19c0-7 6-13 14-13 0 8-6 14-13 14-1 0-1 0-1-1z" />
  ),
};

export default function Icon({ name, size = 20, stroke = 1.8, className = '', ...rest }) {
  const node = paths[name] || paths.spark;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {node}
    </svg>
  );
}
