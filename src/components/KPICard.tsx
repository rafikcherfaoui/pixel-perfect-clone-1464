import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'warning' | 'critical' | 'success' | 'ai';
  trend?: number;
  onClick?: () => void;
}

const variantClasses: Record<string, string> = {
  default: 'border-border',
  warning: 'border-warning/40 glow-warning',
  critical: 'border-critical/40 glow-critical',
  success: 'border-success/40 glow-success',
  ai: 'border-ai/40 glow-ai',
};

const valueClasses: Record<string, string> = {
  default: 'text-foreground',
  warning: 'text-warning',
  critical: 'text-critical',
  success: 'text-success',
  ai: 'text-ai',
};

export default function KPICard({ label, value, subtitle, icon: Icon, variant = 'default', trend, onClick }: KPICardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-card border rounded-xl p-4 text-left transition-all duration-200 hover:bg-surface-elevated group",
        variantClasses[variant],
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        {Icon && <Icon className={cn("w-4 h-4", valueClasses[variant] || 'text-muted-foreground')} />}
      </div>
      <p className={cn("text-2xl font-bold tracking-tight", valueClasses[variant])}>
        {value}
        {trend !== undefined && (
          <span className={cn("text-sm ml-1.5 font-medium", trend > 0 ? 'text-critical' : 'text-success')}>
            {trend > 0 ? '↑' : '↓'}{Math.abs(trend)}%
          </span>
        )}
      </p>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>}
    </button>
  );
}
