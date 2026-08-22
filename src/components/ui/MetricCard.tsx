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
  statusDot
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-colors hover:border-slate-700/80 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">
              {title}
            </span>
            {statusDot && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
            )}
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-mono">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 pt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-800/60 p-2.5 text-slate-400">
          <Icon className="h-4 w-4 text-slate-300" />
        </div>
      </div>
    </div>
  );
}
