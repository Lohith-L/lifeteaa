import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Coffee } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back! 🍵');
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      toast.success('Password reset email sent!');
      setForgotMode(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Coffee className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-display font-bold text-foreground">
            {forgotMode ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {forgotMode ? 'Enter your email to receive a reset link' : 'Your safe space awaits'}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          {forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl" />
              <Button type="submit" className="w-full gradient-hero text-primary-foreground rounded-xl" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <button type="button" onClick={() => setForgotMode(false)} className="w-full text-sm text-muted-foreground hover:text-primary">
                Back to login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl" />
              <Button type="submit" className="w-full gradient-hero text-primary-foreground rounded-xl" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => setForgotMode(true)} className="text-muted-foreground hover:text-primary">
                  Forgot Password?
                </button>
                <Link to="/register" className="text-primary font-semibold hover:underline">Create account</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
