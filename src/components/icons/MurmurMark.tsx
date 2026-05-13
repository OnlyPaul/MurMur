// MurmurMark — the Murmur waveform mark.
// Geometry mirrors design/design-system/assets/murmur-mark.svg (the canonical
// source-of-truth for the brand pipeline). `currentColor` lets callers tint
// the mark via Tailwind text-* classes.

type MurmurMarkProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

const MurmurMark = ({ width, height, className }: MurmurMarkProps) => (
  <svg
    width={width ?? 64}
    height={height ?? 64}
    className={className}
    viewBox="0 0 64 64"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="26" width="6" height="12" rx="3" />
    <rect x="18" y="18" width="6" height="28" rx="3" />
    <rect x="30" y="10" width="6" height="44" rx="3" />
    <rect x="42" y="18" width="6" height="28" rx="3" />
    <rect x="54" y="26" width="6" height="12" rx="3" />
  </svg>
);

export default MurmurMark;
