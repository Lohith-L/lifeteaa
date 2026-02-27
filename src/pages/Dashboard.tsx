import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const CHART_COLORS = [
  'hsl(262, 60%, 58%)', 'hsl(210, 70%, 60%)', 'hsl(330, 60%, 60%)',
  'hsl(160, 50%, 50%)', 'hsl(30, 80%, 55%)', 'hsl(0, 72%, 58%)',
  'hsl(45, 80%, 55%)', 'hsl(262, 50%, 72%)',
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emotionData, setEmotionData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;
    const { data: userPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPosts(userPosts || []);

    const emotionCounts: Record<string, number> = {};
    (userPosts || []).forEach(p => {
      emotionCounts[p.emotion] = (emotionCounts[p.emotion] || 0) + 1;
    });
    setEmotionData(Object.entries(emotionCounts).map(([name, value]) => ({ name, value })));

    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    const daily: Record<string, Record<string, number>> = {};
    last7.forEach(d => { daily[d] = {}; });
    (userPosts || []).forEach(p => {
      const day = p.created_at.split('T')[0];
      if (daily[day]) {
        daily[day][p.emotion] = (daily[day][p.emotion] || 0) + 1;
      }
    });
    const allEmotions = [...new Set((userPosts || []).map(p => p.emotion))];
    setWeeklyData(last7.map(day => ({
      day: day.slice(5),
      ...Object.fromEntries(allEmotions.map(e => [e, daily[day]?.[e] || 0])),
    })));

    setMoodHistory((userPosts || []).slice(0, 30).reverse().map((p, i) => ({
      index: i + 1,
      emotion: p.emotion,
      date: new Date(p.created_at).toLocaleDateString(),
    })));

    setLoading(false);
  };

  const deletePost = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    toast.success('Post deleted');
    fetchData();
  };

  if (!user) return null;

  const todayPosts = posts.filter(p => p.created_at.split('T')[0] === new Date().toISOString().split('T')[0]);
  const todayEmotions: Record<string, number> = {};
  todayPosts.forEach(p => { todayEmotions[p.emotion] = (todayEmotions[p.emotion] || 0) + 1; });
  const dominantToday = Object.entries(todayEmotions).sort(([, a], [, b]) => b - a)[0];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">Your Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Posts', value: posts.length },
            { label: 'Today', value: todayPosts.length },
            { label: 'Top Emotion', value: emotionData[0]?.name || '—' },
            { label: 'Dominant Today', value: dominantToday ? `${dominantToday[0]} (${dominantToday[1]})` : '—' },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-2xl shadow-card p-4 border border-border text-center">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
            <h3 className="font-display font-bold text-foreground mb-4">Emotion Distribution</h3>
            {emotionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={emotionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {emotionData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-center py-8">No data yet</p>}
          </div>

          <div className="bg-card rounded-2xl shadow-card p-5 border border-border">
            <h3 className="font-display font-bold text-foreground mb-4">Weekly Emotions</h3>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  {[...new Set(posts.map(p => p.emotion))].map((e, i) => (
                    <Bar key={e} dataKey={e} stackId="a" fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground text-center py-8">No data yet</p>}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-5 border border-border mb-8">
          <h3 className="font-display font-bold text-foreground mb-4">Mood Tracker (Last 30 Posts)</h3>
          {moodHistory.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {moodHistory.map((m, i) => {
                const emoji = ({'Happy': '😊', 'Sad': '😢', 'Frustrated': '😤', 'Excited': '🎉', 'Anxious': '😰', 'Angry': '😡', 'Hopeless': '😞', 'Stressed': '😫', 'Hopeful': '🌟', 'Confused': '🤔', 'Reflective': '🪞', 'Neutral': '😐'} as any)[m.emotion] || '😐';
                return (
                  <div key={i} className="flex flex-col items-center bg-muted rounded-xl p-2 min-w-[48px]" title={`${m.emotion} - ${m.date}`}>
                    <span className="text-xl">{emoji}</span>
                    <span className="text-[10px] text-muted-foreground">{m.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-muted-foreground text-center py-4">Share some stories to see your mood history!</p>}
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground mb-4">Your Stories</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">You haven't shared any stories yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="relative">
                <PostCard post={post} onRefresh={fetchData} />
                <div className="absolute top-4 right-4 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
