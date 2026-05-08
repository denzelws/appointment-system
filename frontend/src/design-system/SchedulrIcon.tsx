export function SchedulrIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" fill="#4F6EF7" />
      <rect
        x="9"
        y="7"
        width="14"
        height="2"
        rx="1"
        fill="white"
        opacity="0.4"
      />
      <rect x="9" y="7" width="2" height="4" rx="1" fill="white" />
      <rect x="21" y="7" width="2" height="4" rx="1" fill="white" />
      <rect
        x="6"
        y="12"
        width="20"
        height="14"
        rx="3"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="6"
        y="12"
        width="20"
        height="14"
        rx="3"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      <rect
        x="10"
        y="17"
        width="4"
        height="4"
        rx="1"
        fill="#4F6EF7"
        fillOpacity="0.8"
      />
      <rect
        x="16"
        y="17"
        width="4"
        height="4"
        rx="1"
        fill="white"
        fillOpacity="0.4"
      />
      <rect x="10" y="10" width="12" height="1.5" rx="0.75" fill="white" />
    </svg>
  );
}
