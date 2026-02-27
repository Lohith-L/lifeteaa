import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, PlusCircle, BarChart3, User, LogOut, Bell, Coffee } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Coffee className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
          <span className="text-xl font-display font-bold text-foreground">
            Life<span className="text-primary">Tea</span>
          </span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-1">
            <NavBtn to="/feed" active={isActive('/feed')} icon={<Home className="h-4 w-4" />} label="Feed" />
            <NavBtn to="/create" active={isActive('/create')} icon={<PlusCircle className="h-4 w-4" />} label="Share" />
            <NavBtn to="/dashboard" active={isActive('/dashboard')} icon={<BarChart3 className="h-4 w-4" />} label="Dashboard" />
            <NavBtn to="/profile" active={isActive('/profile')} icon={<User className="h-4 w-4" />} label="Profile" />
            <NavBtn to="/notifications" active={isActive('/notifications')} icon={<Bell className="h-4 w-4" />} label="Alerts" />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
            <Button size="sm" onClick={() => navigate('/register')} className="gradient-hero text-primary-foreground">
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

function NavBtn({ to, active, icon, label }: { to: string; active: boolean; icon: React.ReactNode; label: string }) {
  const navigate = useNavigate();
  return (
    <Button
      variant={active ? 'default' : 'ghost'}
      size="sm"
      onClick={() => navigate(to)}
      className={active ? 'gradient-hero text-primary-foreground' : 'text-muted-foreground'}
    >
      {icon}
      <span className="hidden sm:inline ml-1">{label}</span>
    </Button>
  );
}
