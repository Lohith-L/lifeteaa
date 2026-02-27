import { useState } from 'react';
import { X, Wind, Music, Tv, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WellnessModalProps {
  emotion: string;
  onClose: () => void;
}

const WELLNESS_MAP: Record<string, { type: string; icon: typeof Wind; title: string; content: string[] }[]> = {
  Anxious: [
    { type: 'breathing', icon: Wind, title: '🌬️ Guided Breathing', content: ['Inhale slowly for 4 seconds…', 'Hold gently for 4 seconds…', 'Exhale slowly for 6 seconds…', 'Repeat 3 times. You\'re doing great.'] },
    { type: 'music', icon: Music, title: '🎵 Calming Sounds', content: ['Soft ambient rain sounds', 'Gentle piano instrumentals', 'Lo-fi chill beats', 'Nature forest soundscapes'] },
  ],
  Sad: [
    { type: 'music', icon: Music, title: '🎵 Gentle Music', content: ['Soft acoustic guitar melodies', 'Warm instrumental piano', 'Ambient nature sounds', 'Uplifting lo-fi beats'] },
    { type: 'entertainment', icon: Tv, title: '🎬 Uplifting Content', content: ['Cute animal compilation videos', 'Short motivational clips', 'Beautiful nature scenery', 'Heartwarming story shorts'] },
  ],
  Angry: [
    { type: 'breathing', icon: Wind, title: '🌬️ Slow Breathing', content: ['Inhale deeply for 5 seconds…', 'Hold for 3 seconds…', 'Exhale very slowly for 7 seconds…', 'Feel the tension leaving your body.'] },
    { type: 'music', icon: Music, title: '🎵 Grounding Audio', content: ['Ocean waves ambient', 'Tibetan singing bowls', 'Rain on a window', 'Deep forest sounds'] },
  ],
  Overwhelmed: [
    { type: 'breathing', icon: Wind, title: '🌬️ 60-Second Reset', content: ['Close your eyes gently.', 'Breathe in for 4… out for 4…', 'Focus only on your breath.', 'You are safe right now.'] },
    { type: 'music', icon: Music, title: '🎵 Minimal Calm', content: ['Soft white noise', 'Single piano notes', 'Gentle wind chimes', 'Quiet rain sounds'] },
  ],
  Stressed: [
    { type: 'breathing', icon: Wind, title: '🌬️ Quick Calm', content: ['Inhale for 4 seconds…', 'Hold for 4 seconds…', 'Exhale for 6 seconds…', 'Repeat until you feel calmer.'] },
    { type: 'entertainment', icon: Tv, title: '🎬 Light Entertainment', content: ['Funny animal videos', 'Short comedy clips (clean)', 'Satisfying art videos', 'Nature drone footage'] },
  ],
  Frustrated: [
    { type: 'breathing', icon: Wind, title: '🌬️ Release Tension', content: ['Inhale slowly for 5 seconds…', 'Tense your fists for 3 seconds…', 'Exhale and release everything…', 'Feel the frustration melt away.'] },
    { type: 'music', icon: Music, title: '🎵 Soothing Sounds', content: ['Calm jazz instrumentals', 'Acoustic guitar medleys', 'Waterfall ambience', 'Gentle harp music'] },
  ],
  Insecure: [
    { type: 'music', icon: Music, title: '🎵 Uplifting Music', content: ['Empowering instrumental tracks', 'Positive acoustic playlists', 'Motivational film scores', 'Warm jazz piano'] },
    { type: 'entertainment', icon: Tv, title: '🎬 Confidence Boost', content: ['Short motivational talks', 'Positive affirmation videos', 'Inspiring transformation stories', 'Beautiful sunrise compilations'] },
  ],
  Hopeless: [
    { type: 'breathing', icon: Wind, title: '🌬️ Grounding Breath', content: ['Place your feet on the ground.', 'Inhale for 4… hold for 2…', 'Exhale for 6 seconds…', 'You are here. You matter.'] },
    { type: 'music', icon: Music, title: '🎵 Gentle Hope', content: ['Soft sunrise instrumentals', 'Warm acoustic lullabies', 'Peaceful nature sounds', 'Quiet meditation music'] },
  ],
};

const DEFAULT_WELLNESS = [
  { type: 'breathing', icon: Wind, title: '🌬️ Mindful Breathing', content: ['Inhale for 4 seconds…', 'Hold for 4 seconds…', 'Exhale for 6 seconds…', 'Repeat 3 times.'] },
  { type: 'music', icon: Music, title: '🎵 Calming Music', content: ['Lo-fi chill beats', 'Soft piano instrumentals', 'Nature ambient sounds', 'Gentle acoustic guitar'] },
];

export default function WellnessModal({ emotion, onClose }: WellnessModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const options = WELLNESS_MAP[emotion] || DEFAULT_WELLNESS;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden">
        {/* Header */}
        <div className="gradient-hero p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <h2 className="text-lg font-display font-bold">Wellness Support</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm mt-2 opacity-90">
            It sounds like you're feeling <strong>{emotion.toLowerCase()}</strong> right now. That's completely valid. 💜
          </p>
          <p className="text-sm mt-1 opacity-80">Would you like a quick 1-minute reset?</p>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          {selectedOption === null ? (
            <>
              <p className="text-sm text-muted-foreground mb-3">Choose what feels right for you:</p>
              {options.map((opt, i) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(i)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-accent transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{opt.title}</p>
                      <p className="text-xs text-muted-foreground">{opt.content[0]}</p>
                    </div>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="animate-fade-up">
              <h3 className="font-display font-bold text-foreground mb-4">{options[selectedOption].title}</h3>
              <div className="space-y-3">
                {options[selectedOption].content.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground">{step}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" onClick={() => setSelectedOption(null)} className="flex-1 rounded-xl">
                  ← Try another
                </Button>
                <Button onClick={onClose} className="flex-1 gradient-hero text-primary-foreground rounded-xl">
                  I feel better 💜
                </Button>
              </div>
            </div>
          )}

          {selectedOption === null && (
            <p className="text-xs text-center text-muted-foreground mt-3">
              Let me know which one you'd like to try. 🍵
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
