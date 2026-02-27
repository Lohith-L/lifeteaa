import { useState } from 'react';
import { ChevronDown, ChevronUp, Wind, Music, Tv, Heart } from 'lucide-react';

interface SupportSectionProps {
  emotion: string;
  supportMessage?: string;
  cognitiveDistortions?: string[];
  content: string;
}

const DISTORTION_LABELS: Record<string, string> = {
  'self-blame': 'Self-blame pattern detected',
  'catastrophizing': 'Catastrophizing pattern detected',
  'all-or-nothing': 'All-or-nothing thinking detected',
  'overgeneralization': 'Overgeneralization detected',
  'mind-reading': 'Mind-reading pattern detected',
  'fortune-telling': 'Fortune-telling pattern detected',
  'emotional-reasoning': 'Emotional reasoning detected',
  'labeling': 'Labeling pattern detected',
};

const REFRAME_MAP: Record<string, { validation: string; distortion: string; reframe: string; question: string }> = {
  'self-blame': {
    validation: "It sounds incredibly tough to put on a brave face while feeling so lost and disappointed, especially after working so hard.",
    distortion: "This feeling that 'maybe I'm not good enough' often stems from self-blame, connecting your worth to a single outcome.",
    reframe: "💡 One exam result doesn't define your intelligence or effort. Your dedication to studying shows you are good enough, and learning often involves setbacks.",
    question: "🤔 What might you say to a friend who felt the same way about themselves after failing an exam?",
  },
  'catastrophizing': {
    validation: "It's understandable to feel like everything is falling apart when something important goes wrong.",
    distortion: "When we catastrophize, we imagine the worst possible outcome and treat it as certain.",
    reframe: "💡 This is a difficult moment, not a permanent state. Many challenging situations turn out better than our worst fears.",
    question: "🤔 Can you think of a past situation that felt catastrophic but turned out okay?",
  },
  'all-or-nothing': {
    validation: "It makes sense to feel frustrated when things don't go perfectly.",
    distortion: "All-or-nothing thinking makes us see things in extremes — complete success or total failure, with nothing in between.",
    reframe: "💡 Most of life exists in the middle ground. Partial progress is still progress, and imperfect results still have value.",
    question: "🤔 What parts of this situation actually went well, even if the overall result wasn't perfect?",
  },
};

const DEFAULT_REFRAME = {
  validation: "It's completely valid to feel this way. Your emotions are trying to tell you something important.",
  distortion: "Sometimes our thoughts can amplify difficult feelings beyond what the situation calls for.",
  reframe: "💡 Try to separate the feeling from the facts. You are more resilient than this moment suggests.",
  question: "🤔 What would you tell someone you care about if they were in your shoes?",
};

interface WellnessOption {
  icon: typeof Wind;
  emoji: string;
  title: string;
  subtitle: string;
  steps: string[];
}

const WELLNESS_MAP: Record<string, WellnessOption[]> = {
  Anxious: [
    { icon: Wind, emoji: '🌬️', title: 'Gentle Breath Reset', subtitle: 'Guided breathing exercise', steps: ['Inhale slowly for 4 seconds…', 'Hold gently for 4 seconds…', 'Exhale slowly for 6 seconds…', 'Repeat 3 times. You\'re doing great.'] },
    { icon: Music, emoji: '🎵', title: 'Soft ambient rain & piano', subtitle: 'Calming instrumental sounds', steps: ['Soft ambient rain sounds', 'Gentle piano instrumentals', 'Lo-fi chill beats', 'Nature forest soundscapes'] },
    { icon: Tv, emoji: '🎬', title: 'Calming nature scenery', subtitle: 'Peaceful visual content', steps: ['Peaceful ocean waves footage', 'Forest walk compilations', 'Sunrise timelapses', 'Gentle animal videos'] },
  ],
  Sad: [
    { icon: Wind, emoji: '🌬️', title: 'Gentle Breath Reset', subtitle: 'Slow, calming breathing', steps: ['Take a deep breath in for 4 seconds…', 'Hold gently for 2 seconds…', 'Exhale slowly for 6 seconds…', 'You\'re allowed to feel this.'] },
    { icon: Music, emoji: '🎵', title: 'Instrumental orchestral & acoustic guitar', subtitle: 'Warm, uplifting instrumentals', steps: ['Soft acoustic guitar melodies', 'Warm instrumental piano', 'Ambient nature sounds', 'Uplifting orchestral pieces'] },
    { icon: Tv, emoji: '🎬', title: 'Uplifting short stories & motivational clips', subtitle: 'Heartwarming content', steps: ['Cute animal compilation videos', 'Short motivational clips', 'Beautiful nature scenery', 'Heartwarming story shorts'] },
  ],
  Angry: [
    { icon: Wind, emoji: '🌬️', title: 'Slow Release Breathing', subtitle: 'Release tension gradually', steps: ['Inhale deeply for 5 seconds…', 'Tense your fists for 3 seconds…', 'Exhale very slowly for 7 seconds…', 'Feel the tension leaving your body.'] },
    { icon: Music, emoji: '🎵', title: 'Grounding ocean & bowl sounds', subtitle: 'Grounding audio', steps: ['Ocean waves ambient', 'Tibetan singing bowls', 'Rain on a window', 'Deep forest sounds'] },
    { icon: Tv, emoji: '🎬', title: 'Satisfying & calming videos', subtitle: 'Visual grounding', steps: ['Satisfying art videos', 'Nature drone footage', 'Calm cooking compilations', 'Peaceful garden tours'] },
  ],
  Overwhelmed: [
    { icon: Wind, emoji: '🌬️', title: '60-Second Reset', subtitle: 'Quick mindful pause', steps: ['Close your eyes gently.', 'Breathe in for 4… out for 4…', 'Focus only on your breath.', 'You are safe right now.'] },
    { icon: Music, emoji: '🎵', title: 'Minimal calming sounds', subtitle: 'Simple, quiet audio', steps: ['Soft white noise', 'Single piano notes', 'Gentle wind chimes', 'Quiet rain sounds'] },
    { icon: Tv, emoji: '🎬', title: 'Simple nature footage', subtitle: 'Minimal visual calm', steps: ['Slow river streams', 'Cloud timelapse videos', 'Gentle snowfall footage', 'Quiet beach scenes'] },
  ],
  Stressed: [
    { icon: Wind, emoji: '🌬️', title: 'Quick Calm Breathing', subtitle: '4-4-6 breathing pattern', steps: ['Inhale for 4 seconds…', 'Hold for 4 seconds…', 'Exhale for 6 seconds…', 'Repeat until you feel calmer.'] },
    { icon: Music, emoji: '🎵', title: 'Lo-fi & ambient beats', subtitle: 'Stress-relief sounds', steps: ['Lo-fi chill beats', 'Ambient electronic', 'Soft jazz piano', 'Rain & thunder sounds'] },
    { icon: Tv, emoji: '🎬', title: 'Funny animal videos & comedy', subtitle: 'Light entertainment', steps: ['Funny animal videos', 'Short comedy clips (clean)', 'Satisfying art videos', 'Nature drone footage'] },
  ],
  Frustrated: [
    { icon: Wind, emoji: '🌬️', title: 'Tension Release Breathing', subtitle: 'Physical release exercise', steps: ['Inhale slowly for 5 seconds…', 'Tense your fists for 3 seconds…', 'Exhale and release everything…', 'Feel the frustration melt away.'] },
    { icon: Music, emoji: '🎵', title: 'Calm jazz & acoustic', subtitle: 'Soothing melodies', steps: ['Calm jazz instrumentals', 'Acoustic guitar medleys', 'Waterfall ambience', 'Gentle harp music'] },
    { icon: Tv, emoji: '🎬', title: 'Satisfying compilation videos', subtitle: 'Visual stress relief', steps: ['Oddly satisfying compilations', 'Pottery making videos', 'Calligraphy clips', 'Nature ASMR'] },
  ],
  Insecure: [
    { icon: Wind, emoji: '🌬️', title: 'Confidence Breathing', subtitle: 'Grounding & empowering', steps: ['Stand or sit tall.', 'Inhale confidence for 4 seconds…', 'Hold your strength for 4…', 'Exhale doubt for 6 seconds.'] },
    { icon: Music, emoji: '🎵', title: 'Empowering instrumentals', subtitle: 'Uplifting music', steps: ['Empowering instrumental tracks', 'Positive acoustic playlists', 'Motivational film scores', 'Warm jazz piano'] },
    { icon: Tv, emoji: '🎬', title: 'Motivational talks & affirmations', subtitle: 'Confidence boost', steps: ['Short motivational talks', 'Positive affirmation videos', 'Inspiring transformation stories', 'Beautiful sunrise compilations'] },
  ],
  Hopeless: [
    { icon: Wind, emoji: '🌬️', title: 'Grounding Breath', subtitle: 'You are here. You matter.', steps: ['Place your feet on the ground.', 'Inhale for 4… hold for 2…', 'Exhale for 6 seconds…', 'You are here. You matter.'] },
    { icon: Music, emoji: '🎵', title: 'Gentle hope instrumentals', subtitle: 'Soft warming sounds', steps: ['Soft sunrise instrumentals', 'Warm acoustic lullabies', 'Peaceful nature sounds', 'Quiet meditation music'] },
    { icon: Tv, emoji: '🎬', title: 'Hope & redemption stories', subtitle: 'Inspiring content', steps: ['Comeback story compilations', 'Acts of kindness videos', 'Recovery journey shorts', 'Nature renewal footage'] },
  ],
};

const DEFAULT_WELLNESS: WellnessOption[] = [
  { icon: Wind, emoji: '🌬️', title: 'Gentle Breath Reset', subtitle: 'Mindful breathing', steps: ['Inhale for 4 seconds…', 'Hold for 4 seconds…', 'Exhale for 6 seconds…', 'Repeat 3 times.'] },
  { icon: Music, emoji: '🎵', title: 'Calming instrumentals', subtitle: 'Soothing sounds', steps: ['Lo-fi chill beats', 'Soft piano instrumentals', 'Nature ambient sounds', 'Gentle acoustic guitar'] },
  { icon: Tv, emoji: '🎬', title: 'Uplifting content', subtitle: 'Feel-good videos', steps: ['Cute animal videos', 'Nature compilations', 'Motivational shorts', 'Peaceful scenery'] },
];

export default function SupportSection({ emotion, supportMessage, cognitiveDistortions, content }: SupportSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const options = WELLNESS_MAP[emotion] || DEFAULT_WELLNESS;

  const distortion = cognitiveDistortions?.[0] || null;
  const reframe = distortion ? (REFRAME_MAP[distortion] || DEFAULT_REFRAME) : null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="mt-3 pt-3 border-t border-border space-y-3 animate-fade-up">
      {/* Cognitive distortion support - like image 2 */}
      {reframe && (
        <div className="bg-primary/5 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              💜 {distortion ? (DISTORTION_LABELS[distortion] || 'Thinking pattern detected') : 'Support'}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{reframe.validation}</p>
          <p className="text-sm text-muted-foreground italic leading-relaxed">{reframe.distortion}</p>
          <p className="text-sm text-foreground leading-relaxed">{reframe.reframe}</p>
          <p className="text-sm text-primary leading-relaxed">{reframe.question}</p>
        </div>
      )}

      {/* AI support message */}
      {supportMessage && !reframe && (
        <div className="bg-primary/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">💜 Support</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{supportMessage}</p>
        </div>
      )}

      {/* Wellness reset - accordion style like image 1 */}
      <div>
        <p className="text-sm text-foreground mb-2 flex items-center gap-1.5">
          <span>✨</span> Would you like a quick 1-minute reset?
        </p>
        <div className="space-y-2">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            const isOpen = openIndex === i;
            return (
              <div key={i} className="rounded-xl border border-border overflow-hidden bg-muted/30">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {opt.emoji} {opt.title}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 pt-1 space-y-2 animate-fade-up">
                    {opt.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-2.5 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        <span className="text-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-primary mt-2.5">
          Let me know which one you'd like to try 💜
        </p>
      </div>
    </div>
  );
}
