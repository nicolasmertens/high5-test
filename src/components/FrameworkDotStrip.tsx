const COLORS = {
  strengths: '#f59e0b',
  personality: '#8b5cf6',
  disc: '#ef4444',
  enneagram: '#10b981',
} as const;

type Framework = keyof typeof COLORS;

export function FrameworkDot({ framework, size = 6 }: { framework: Framework; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: COLORS[framework],
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
    />
  );
}

export function FrameworkDotStrip({ size = 6, gap = 4 }: { size?: number; gap?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      {(['strengths', 'personality', 'disc', 'enneagram'] as const).map((f) => (
        <FrameworkDot key={f} framework={f} size={size} />
      ))}
    </span>
  );
}
