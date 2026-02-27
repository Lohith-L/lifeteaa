import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.name || '');
  }, [profile]);

  if (!user) { navigate('/login'); return null; }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('user_id', user.id);
      if (error) throw error;
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-md">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">Profile</h1>
        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Email</label>
              <Input value={user.email || ''} disabled className="rounded-xl bg-muted" />
            </div>
            <Button type="submit" className="w-full gradient-hero text-primary-foreground rounded-xl" disabled={loading}>
              {loading ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
