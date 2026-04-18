interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 20, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="4" fill="#f59e0b" />
      <circle cx="24" cy="8" r="4" fill="#8b5cf6" />
      <circle cx="8" cy="24" r="4" fill="#ef4444" />
      <circle cx="24" cy="24" r="4" fill="#10b981" />
    </svg>
  );
}
