import { useRef, useState, ReactNode, CSSProperties } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  spotlightColor?: string;
  onClick?: (() => void) | null;
}

export default function SpotlightCard({
  children,
  className = '',
  style,
  spotlightColor = 'rgba(59,130,246,0.12)',
  onClick,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ ...style, cursor: onClick ? 'pointer' : undefined }}
      onClick={onClick ?? undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos(p => ({ ...p, visible: false }))}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.visible ? 1 : 0,
          background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
