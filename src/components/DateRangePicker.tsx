import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, subDays, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Props {
  label?: string;
}

export default function DateRangePicker({ label = 'Période' }: Props) {
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(today, 29),
    to: today,
  });

  const presets = [
    { label: '7 derniers jours', get: () => ({ from: subDays(today, 6), to: today }) },
    { label: '30 derniers jours', get: () => ({ from: subDays(today, 29), to: today }) },
    { label: 'Mois en cours', get: () => ({ from: startOfMonth(today), to: today }) },
    { label: 'Trimestre en cours', get: () => ({ from: startOfQuarter(today), to: today }) },
    { label: 'Année en cours', get: () => ({ from: startOfYear(today), to: today }) },
  ];

  const formatLabel = () => {
    if (range?.from && range?.to) {
      return `${format(range.from, 'dd MMM yyyy', { locale: fr })} — ${format(range.to, 'dd MMM yyyy', { locale: fr })}`;
    }
    return label;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors"
          style={{ borderColor: '#30363d' }}
        >
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">{formatLabel()}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-auto p-0 border"
        style={{ backgroundColor: '#1c2333', borderColor: '#30363d' }}
      >
        <div className="flex">
          <div className="flex flex-col gap-1.5 p-3 border-r" style={{ borderColor: '#30363d', minWidth: 180 }}>
            <p className="text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Préréglages</p>
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => setRange(p.get())}
                className="text-left text-xs px-2.5 py-1.5 rounded-md text-foreground hover:bg-secondary transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            locale={fr}
            className={cn('p-3 pointer-events-auto')}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
