import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EMOTIONS, CATEGORIES, getRandomAnonymousName } from '@/lib/emotions';
import EmergencyModal from '@/components/EmergencyModal';
import { toast } from 'sonner';
import { Send, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('');
  const [category, setCategory] = useState('Personal');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiEmotion, setAiEmotion] = useState('');
  const [aiSupportMessage, setAiSupportMessage] = useState('');
  const [aiDistortions, setAiDistortions] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState<'normal' | 'high' | 'critical' | null>(null);
  const [detecting, setDetecting] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const detectEmotion = async () => {
    if (!content.trim()) return;
    setDetecting(true);
    try {
      const res = await supabase.functions.invoke('analyze-emotion', {
        body: { text: content },
      });
      if (res.data) {
        setAiEmotion(res.data.emotion || '');
        if (res.data.supportMessage) setAiSupportMessage(res.data.supportMessage);
        if (res.data.cognitiveDistortions) setAiDistortions(res.data.cognitiveDistortions);
        if (!emotion && res.data.emotion) setEmotion(res.data.emotion);
        if (res.data.riskLevel === 'high' || res.data.riskLevel === 'critical') {
          setRiskLevel(res.data.riskLevel);
        }
        if (res.data.toxic) {
          toast.error('This content may be harmful. Please consider rephrasing.');
        }
        toast.success(`AI detected: ${res.data.emotion} ${res.data.emoji || ''}`);
      }
    } catch {
      toast.error('AI detection unavailable');
    } finally {
      setDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !emotion) return toast.error('Please write something and select an emotion');
    setLoading(true);
    try {
      const anonymousName = isAnonymous ? getRandomAnonymousName(emotion) : null;
      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: content.trim(),
        emotion,
        ai_emotion: aiEmotion || null,
        category,
        is_anonymous: isAnonymous,
        anonymous_name: anonymousName,
        risk_level: riskLevel === 'high' || riskLevel === 'critical' ? riskLevel : 'low',
        support_message: aiSupportMessage || null,
        cognitive_distortions: aiDistortions.length > 0 ? aiDistortions : [],
      } as any);
      if (error) throw error;
      toast.success('Story shared! 🍵');
      navigate('/feed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">Share Your Story</h1>

        <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Content */}
            <div>
              <Textarea
                placeholder="What's on your mind? Share your feelings..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="rounded-xl resize-none text-base"
                required
              />
              <div className="flex justify-between items-center mt-2">
                <Button type="button" variant="outline" size="sm" onClick={detectEmotion} disabled={detecting || !content.trim()} className="rounded-xl text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {detecting ? 'Detecting...' : 'AI Detect Emotion'}
                </Button>
                {aiEmotion && (
                  <span className="text-xs text-muted-foreground">AI suggests: <strong className="text-primary">{aiEmotion}</strong></span>
                )}
              </div>
            </div>

            {/* Emotion selector */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">How are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map(e => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => setEmotion(e.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      emotion === e.value
                        ? 'gradient-hero text-primary-foreground shadow-glow scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {e.emoji} {e.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      category === c
                        ? 'bg-secondary text-secondary-foreground ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous toggle */}
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isAnonymous ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              {isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isAnonymous ? 'Posting anonymously' : 'Post with your name'}
            </button>

            <Button type="submit" className="w-full gradient-hero text-primary-foreground rounded-xl py-3 text-base" disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sharing...' : 'Share Story'}
            </Button>
          </form>
        </div>
      </div>

      <EmergencyModal level={riskLevel} onClose={() => setRiskLevel(null)} />
    </div>
  );
}
