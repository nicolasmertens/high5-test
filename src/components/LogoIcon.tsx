interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 20, className }: LogoIconProps) {
  return (
    <img
      src="/favicon.svg"
      alt="1Test logo"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
