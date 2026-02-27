import { Button } from '@/components/ui/button';
import { Phone, AlertTriangle, X } from 'lucide-react';

interface EmergencyModalProps {
  level: 'normal' | 'high' | 'critical' | null;
  onClose: () => void;
}

export default function EmergencyModal({ level, onClose }: EmergencyModalProps) {
  if (!level || level === 'normal') return null;

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-card-hover max-w-md w-full p-6 relative animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {level === 'high' && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-6 w-6 text-tea-orange" />
              <h2 className="text-xl font-display font-bold text-tea-orange">You deserve support</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              It seems you're going through intense distress. Please consider reaching out to someone right now.
            </p>
            <div className="space-y-2">
              <a href="tel:9152987821" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-tea-orange text-primary-foreground font-semibold">
                <Phone className="h-4 w-4" /> Call Mental Health Helpline
              </a>
              <Button variant="secondary" className="w-full" onClick={onClose}>Stay in App</Button>
            </div>
          </>
        )}

        {level === 'critical' && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <h2 className="text-xl font-display font-bold text-destructive">Immediate Action Recommended</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We've noticed signs of severe distress. Please contact emergency services or a mental health professional.
            </p>
            <div className="space-y-2">
              <a href="tel:112" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold">
                🚨 Call Emergency (112)
              </a>
              <a href="tel:9152987821" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-tea-orange text-primary-foreground font-semibold">
                <Phone className="h-4 w-4" /> Call Mental Health Helpline
              </a>
              <a href="https://www.practo.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-tea-yellow text-foreground font-semibold">
                Find a Psychiatrist
              </a>
              <Button variant="secondary" className="w-full" onClick={onClose}>Continue</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
