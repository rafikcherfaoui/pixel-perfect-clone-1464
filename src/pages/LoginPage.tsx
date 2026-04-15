import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Shield, BarChart3, PieChart, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { Role } from '@/data/mockData';

const roles: { id: Role; label: string; desc: string; icon: typeof Truck; color: string; ring: string }[] = [
  { id: 'fleet-manager', label: 'Gestionnaire de Flotte', desc: 'Supervision opérationnelle de la flotte', icon: Truck, color: 'text-emerald-400', ring: 'ring-emerald-500/60' },
  { id: 'dg', label: 'Directeur Général', desc: 'Tableau de bord stratégique et performance', icon: BarChart3, color: 'text-purple-400', ring: 'ring-purple-500/60' },
  { id: 'controlling', label: 'Contrôleur de Gestion', desc: 'Analyse financière et contrôle des coûts', icon: PieChart, color: 'text-blue-400', ring: 'ring-blue-500/60' },
];

const defaultEmails: Record<Role, string> = {
  'fleet-manager': 'fleet@nexttransit.dz',
  'dg': 'dg@nexttransit.dz',
  'controlling': 'controlling@nexttransit.dz',
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(defaultEmails[role]);
    setPassword('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    const success = login(email, password, selectedRole);
    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0d1117' }}>
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            Next<span className="text-primary">Transit</span>
          </span>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-1">
          Plateforme de Gestion de Flotte Intelligente
        </p>
        <p className="text-center text-xs text-muted-foreground/70 mb-8">
          Choisissez votre rôle pour continuer
        </p>

        {/* Role cards */}
        <div className="space-y-3 mb-6">
          {roles.map(({ id, label, desc, icon: Icon, color, ring }) => (
            <button
              key={id}
              onClick={() => handleRoleSelect(id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                selectedRole === id
                  ? `border-transparent ring-2 ${ring} bg-card/80`
                  : "border-border/50 bg-card/40 hover:bg-card/60 hover:border-border"
              )}
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", 
                selectedRole === id ? "bg-card" : "bg-secondary")}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Login form */}
        {selectedRole && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="h-px bg-border/50 mb-4" />
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-secondary text-sm text-foreground px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                placeholder="email@nexttransit.dz"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-secondary text-sm text-foreground px-3 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <p className="text-xs text-destructive font-medium bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Se connecter
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
