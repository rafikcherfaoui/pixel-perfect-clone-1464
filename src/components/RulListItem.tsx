interface Props {
  vehicleId: string;
  component: string;
  rulPercent: number;
  daysRemaining: number;
}

export default function RulListItem({ vehicleId, component, rulPercent, daysRemaining }: Props) {
  const color =
    rulPercent < 20 ? '#f85149' : rulPercent < 35 ? '#fb923c' : '#fbbf24';

  return (
    <div className="space-y-1 p-1.5 -m-1.5 rounded-md">
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground font-medium">{vehicleId}</span>
        <span className="text-muted-foreground">{component}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${rulPercent}%`, backgroundColor: color }} />
        </div>
        <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>
          {rulPercent}%
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground">{daysRemaining} jours restants</p>
    </div>
  );
}
