import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon: LucideIcon;
  accentColor?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'purple';
  statusDot?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  accentColor = 'cyan',
  statusDot
}: MetricCardProps) {
  const accentStyles = {
    cyan: {
      border: 'border-cyan-900/40 hover:border-cyan-700/60',
      iconBg: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50',
      glow: 'from-cyan-950/20 to-transparent'
    },
    emerald: {
      border: 'border-emerald-900/40 hover:border-emerald-700/60',
      iconBg: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
      glow: 'from-emerald-950/20 to-transparent'
    },
    amber: {
      border: 'border-amber-900/40 hover:border-amber-700/60',
      iconBg: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
      glow: 'from-amber-950/20 to-transparent'
    },
    rose: {
      border: 'border-rose-900/40 hover:border-rose-700/60',
      iconBg: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
      glow: 'from-rose-950/20 to-transparent'
    },
    purple: {
      border: 'border-purple-900/40 hover:border-purple-700/60',
      iconBg: 'bg-purple-950/60 text-purple-400 border-purple-800/50',
      glow: 'from-purple-950/20 to-transparent'
    }
  };

  const style = accentStyles[accentColor];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-slate-900/80 p-5 backdrop-blur-md transition-all duration-200 ${style.border}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${style.glow} pointer-events-none`} />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
              {title}
            </span>
            {statusDot && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-100 font-mono">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-mono font-medium ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 font-sans">{subtitle}</p>
          )}
        </div>

        <div className={`rounded-lg border p-2.5 ${style.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
