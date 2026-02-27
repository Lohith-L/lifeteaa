import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PostCard from '@/components/PostCard';
import { EMOTIONS, CATEGORIES } from '@/lib/emotions';
import { Loader2, Filter } from 'lucide-react';

export default function HomeFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEmotion, setFilterEmotion] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchPosts = useCallback(async () => {
    let query = supabase
      .from('posts')
      .select('*, profiles:user_id(name)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (filterEmotion) query = query.eq('emotion', filterEmotion);
    if (filterCategory) query = query.eq('category', filterCategory);
    if (filterDate === 'today') {
      query = query.gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
    } else if (filterDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    }

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  }, [filterEmotion, filterCategory, filterDate]);

  useEffect(() => {
    fetchPosts();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('feed-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">Community Feed</h1>

        {/* Filters */}
        <div className="bg-card rounded-2xl shadow-card p-4 border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
              className="bg-muted text-foreground text-sm rounded-xl px-3 py-1.5 border-0"
            >
              <option value="">All Emotions</option>
              {EMOTIONS.map(e => <option key={e.value} value={e.value}>{e.emoji} {e.value}</option>)}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-muted text-foreground text-sm rounded-xl px-3 py-1.5 border-0"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-muted text-foreground text-sm rounded-xl px-3 py-1.5 border-0"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No stories yet. Be the first to share! 🍵</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} showSimilar onRefresh={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
