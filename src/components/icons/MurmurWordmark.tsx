// MurmurWordmark — the Murmur mark + wordmark lockup.
// Geometry mirrors design/design-system/assets/wordmark.svg.

// Brand name — intentionally untranslated.
const BRAND_NAME = "Murmur";

type MurmurWordmarkProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

const MurmurWordmark = ({ width, height, className }: MurmurWordmarkProps) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 220 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(0 12)" fill="currentColor">
      <rect x="0" y="14" width="4" height="8" rx="2" />
      <rect x="8" y="9" width="4" height="18" rx="2" />
      <rect x="16" y="3" width="4" height="30" rx="2" />
      <rect x="24" y="9" width="4" height="18" rx="2" />
      <rect x="32" y="14" width="4" height="8" rx="2" />
    </g>
    <text
      x="52"
      y="38"
      fontFamily="Inter, system-ui, sans-serif"
      fontWeight={600}
      fontSize={32}
      letterSpacing="-0.5"
      fill="currentColor"
    >
      {BRAND_NAME}
    </text>
  </svg>
);

export default MurmurWordmark;
