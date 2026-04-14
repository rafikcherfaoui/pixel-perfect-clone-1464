import { Truck } from 'lucide-react';
import { Vehicle } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

function getHealthColor(score: number, active: boolean) {
  if (!active) return 'border-muted bg-muted/20 opacity-50';
  if (score >= 75) return 'border-success/50 hover:border-success';
  if (score >= 50) return 'border-warning/50 hover:border-warning';
  if (score >= 30) return 'border-orange-500/50 hover:border-orange-500';
  return 'border-critical/50 hover:border-critical animate-pulse-glow';
}

function getIconColor(score: number, active: boolean) {
  if (!active) return 'text-muted-foreground';
  if (score >= 75) return 'text-success';
  if (score >= 50) return 'text-warning';
  if (score >= 30) return 'text-orange-500';
  return 'text-critical';
}

export default function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-card border-2 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all duration-200 hover:bg-surface-elevated cursor-pointer group",
        getHealthColor(vehicle.healthScore, vehicle.active)
      )}
    >
      <Truck className={cn("w-7 h-7 transition-transform group-hover:scale-110", getIconColor(vehicle.healthScore, vehicle.active))} />
      <span className="text-xs font-semibold text-foreground">{vehicle.id}</span>
      <span className={cn("text-[10px] font-bold", getIconColor(vehicle.healthScore, vehicle.active))}>
        {vehicle.active ? `${vehicle.healthScore}%` : 'Inactif'}
      </span>
    </button>
  );
}
