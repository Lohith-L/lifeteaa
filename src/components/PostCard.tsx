import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, ChevronDown, ChevronUp, HandHeart } from 'lucide-react';
import EmotionBadge from './EmotionBadge';
import SupportSection from './SupportSection';
import PostPoll from './PostPoll';
import { formatTimeAgo } from '@/lib/emotions';
import { toast } from 'sonner';

interface PostCardProps {
  post: any;
  showSimilar?: boolean;
  onRefresh?: () => void;
}

export default function PostCard({ post, showSimilar = false, onRefresh }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [similarPosts, setSimilarPosts] = useState<any[]>([]);
  const [showSupport, setShowSupport] = useState(false);
  const [showSimilarSection, setShowSimilarSection] = useState(false);

  const displayName = post.is_anonymous
    ? (post.anonymous_name || 'Anonymous')
    : (post.profiles?.name || 'User');

  const handleLike = async () => {
    if (!user) return toast.error('Please log in to like posts');
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      setLiked(false);
      setLikesCount((c: number) => c - 1);
    } else {
      await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
      setLiked(true);
      setLikesCount((c: number) => c + 1);
      if (post.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          message: `Someone liked your post`,
          post_id: post.id,
        });
      }
    }
  };

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles:user_id(name)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const toggleComments = async () => {
    if (!showComments) await loadComments();
    setShowComments(!showComments);
  };

  const submitComment = async () => {
    if (!user || !commentText.trim()) return;
    await supabase.from('comments').insert({
      post_id: post.id,
      user_id: user.id,
      text: commentText.trim(),
    });
    if (post.user_id !== user.id) {
      await supabase.from('notifications').insert({
        user_id: post.user_id,
        message: `Someone commented on your post`,
        post_id: post.id,
      });
    }
    setCommentText('');
    await loadComments();
    onRefresh?.();
    toast.success('Comment added!');
  };

  const loadSimilar = async () => {
    if (showSimilarSection) {
      setShowSimilarSection(false);
      return;
    }
    const { data } = await supabase
      .from('posts')
      .select('*, profiles:user_id(name)')
      .eq('emotion', post.emotion)
      .neq('id', post.id)
      .order('created_at', { ascending: false })
      .limit(4);
    setSimilarPosts(data || []);
    setShowSimilarSection(true);
  };

  return (
    <div className="bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 border border-border animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold">
            {displayName[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(post.created_at)}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <EmotionBadge emotion={post.emotion} size="sm" />
          {post.ai_emotion && post.ai_emotion !== post.emotion && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
              AI: {post.ai_emotion}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed mb-3">{post.content}</p>

      {/* Category + Risk */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
          {post.category}
        </span>
        {post.risk_level === 'high' && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
            ⚠️ Support available
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-tea-pink' : 'text-muted-foreground hover:text-tea-pink'}`}>
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          {likesCount}
        </button>
        <button onClick={toggleComments} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="h-4 w-4" />
          {post.comments_count || 0}
        </button>
        <button onClick={() => setShowSupport(!showSupport)} className={`flex items-center gap-1.5 text-sm transition-colors ${showSupport ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
          <HandHeart className="h-4 w-4" />
          Support
        </button>
        {showSimilar && (
          <button onClick={loadSimilar} className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            Similar {showSimilarSection ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>

      {/* Inline Support Section */}
      {showSupport && (
        <SupportSection
          emotion={post.emotion}
          supportMessage={post.support_message}
          cognitiveDistortions={post.cognitive_distortions}
          content={post.content}
        />
      )}

      {/* Poll */}
      <PostPoll postId={post.id} postUserId={post.user_id} />

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          {comments.map(c => (
            <div key={c.id} className="bg-muted rounded-lg p-2 text-sm">
              <span className="font-semibold text-foreground">{c.profiles?.name || 'User'}: </span>
              <span className="text-muted-foreground">{c.text}</span>
            </div>
          ))}
          {user && (
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-muted rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground border-0 outline-none focus:ring-1 focus:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              />
              <Button size="sm" onClick={submitComment} className="gradient-hero text-primary-foreground">
                Post
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Similar posts */}
      {showSimilarSection && similarPosts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Similar Posts</p>
          <div className="space-y-2">
            {similarPosts.map(sp => (
              <div key={sp.id} className="bg-muted/50 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <EmotionBadge emotion={sp.emotion} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {sp.is_anonymous ? sp.anonymous_name : sp.profiles?.name} • {formatTimeAgo(sp.created_at)}
                  </span>
                </div>
                <p className="text-foreground line-clamp-2">{sp.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
