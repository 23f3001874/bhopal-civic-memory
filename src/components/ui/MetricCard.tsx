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
    <div className="card-surface p-5 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#A7AFBD] font-medium">
              {title}
            </span>
            {statusDot && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#00DFD8] inline-block shadow-[0_0_6px_#00DFD8]" />
            )}
          </div>
          <div className="flex items-baseline gap-2 pt-1.5">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F7FA] font-mono">
              {value}
            </span>
            {trend && (
              <span
                className={`font-mono text-xs font-medium ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#687386] pt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-[#A7AFBD]">
          <Icon className="h-4 w-4 text-[#F5F7FA]" />
        </div>
      </div>
    </div>
  );
}
