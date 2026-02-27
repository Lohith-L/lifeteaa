import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import heroImg from '@/assets/hero-tea.png';
import { Heart, Shield, Users, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/feed');
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left animate-fade-up">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-tight mb-6">
              Express.<br />
              <span className="text-primary">Heal.</span><br />
              Connect.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              A safe space to share your stories, emotions, and find a supportive community that truly understands. 
              Let your feelings flow like warm tea. 🍵
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Button size="lg" onClick={() => navigate('/register')} className="gradient-hero text-primary-foreground px-8 py-6 text-lg rounded-2xl shadow-glow">
                Start Sharing
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="px-8 py-6 text-lg rounded-2xl border-primary/20">
                Log In
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src={heroImg} alt="LifeTea cup with hearts" className="w-80 md:w-96 animate-float drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center text-foreground mb-12">
            Why LifeTea?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Share Safely', desc: 'Post anonymously or publicly — your choice, your comfort.' },
              { icon: Shield, title: 'AI-Powered Safety', desc: 'Smart emotion detection and crisis support built in.' },
              { icon: Users, title: 'Community', desc: 'Connect with people who truly understand your journey.' },
              { icon: Sparkles, title: 'Mood Insights', desc: 'Track your emotional patterns with beautiful analytics.' },
            ].map((f, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center group">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        <p>🍵 LifeTea — Express. Heal. Connect.</p>
      </footer>
    </div>
  );
}
