import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Coffee } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success('Account created! Welcome to LifeTea 🍵');
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Coffee className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-display font-bold text-foreground">Join LifeTea</h1>
          <p className="text-muted-foreground mt-1">Start your emotional wellness journey</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl" />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl" />
            <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl" />
            <Button type="submit" className="w-full gradient-hero text-primary-foreground rounded-xl" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
