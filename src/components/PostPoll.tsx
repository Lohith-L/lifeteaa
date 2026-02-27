import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, BarChart3, X } from 'lucide-react';
import { toast } from 'sonner';

interface PostPollProps {
  postId: string;
  postUserId: string;
}

interface PollOption {
  id: string;
  label: string;
  votes_count: number;
}

interface Poll {
  id: string;
  question: string;
  created_by: string;
  options: PollOption[];
}

export default function PostPoll({ postId, postUserId }: PostPollProps) {
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPoll();
  }, [postId]);

  const loadPoll = async () => {
    const { data: polls } = await supabase
      .from('polls')
      .select('*')
      .eq('post_id', postId)
      .limit(1);

    if (polls && polls.length > 0) {
      const p = polls[0];
      const { data: options } = await supabase
        .from('poll_options')
        .select('*')
        .eq('poll_id', p.id)
        .order('created_at', { ascending: true });

      setPoll({ ...p, options: options || [] });

      if (user) {
        const { data: vote } = await supabase
          .from('poll_votes')
          .select('option_id')
          .eq('poll_id', p.id)
          .eq('user_id', user.id)
          .maybeSingle();
        setUserVote(vote?.option_id || null);
      }
    } else {
      setPoll(null);
    }
    setLoading(false);
  };

  const createPoll = async () => {
    if (!user || !newQuestion.trim()) return;
    const validOptions = newOptions.filter(o => o.trim());
    if (validOptions.length < 2) return toast.error('Add at least 2 options');

    setSubmitting(true);
    try {
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert({ post_id: postId, question: newQuestion.trim(), created_by: user.id })
        .select()
        .single();

      if (pollError) throw pollError;

      const optionsToInsert = validOptions.map(label => ({
        poll_id: pollData.id,
        label: label.trim(),
      }));

      const { error: optError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert);

      if (optError) throw optError;

      toast.success('Poll created! 📊');
      setCreating(false);
      setNewQuestion('');
      setNewOptions(['', '']);
      await loadPoll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create poll');
    } finally {
      setSubmitting(false);
    }
  };

  const vote = async (optionId: string) => {
    if (!user) return toast.error('Please log in to vote');
    if (userVote) return toast.info('You already voted on this poll');

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({ poll_id: poll!.id, option_id: optionId, user_id: user.id });
      if (error) throw error;
      setUserVote(optionId);
      toast.success('Vote recorded!');
      await loadPoll();
    } catch (err: any) {
      toast.error(err.message || 'Failed to vote');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePoll = async () => {
    if (!poll || !user) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('polls').delete().eq('id', poll.id);
      if (error) throw error;
      setPoll(null);
      toast.success('Poll deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete poll');
    } finally {
      setSubmitting(false);
    }
  };

  const addOption = () => {
    if (newOptions.length >= 5) return;
    setNewOptions([...newOptions, '']);
  };

  const removeOption = (index: number) => {
    if (newOptions.length <= 2) return;
    setNewOptions(newOptions.filter((_, i) => i !== index));
  };

  if (loading) return null;

  const totalVotes = poll?.options.reduce((s, o) => s + o.votes_count, 0) || 0;
  const canDelete = poll && user && poll.created_by === user.id;

  return (
    <div className="mt-3">
      {/* Existing poll */}
      {poll && (
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">{poll.question}</p>
            </div>
            {canDelete && (
              <button
                onClick={deletePoll}
                disabled={submitting}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10"
                title="Delete poll"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {poll.options.map(opt => {
              const pct = totalVotes > 0 ? Math.round((opt.votes_count / totalVotes) * 100) : 0;
              const isVoted = userVote === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => vote(opt.id)}
                  disabled={!!userVote || submitting}
                  className={`w-full relative rounded-xl overflow-hidden text-left transition-all ${
                    isVoted ? 'ring-2 ring-primary' : ''
                  } ${userVote ? 'cursor-default' : 'hover:ring-1 hover:ring-primary/50 cursor-pointer'}`}
                >
                  <div
                    className="absolute inset-0 bg-primary/10 transition-all duration-500"
                    style={{ width: userVote ? `${pct}%` : '0%' }}
                  />
                  <div className="relative flex items-center justify-between px-3 py-2">
                    <span className={`text-sm ${isVoted ? 'font-semibold text-primary' : 'text-foreground'}`}>
                      {opt.label}
                    </span>
                    {userVote && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {pct}% ({opt.votes_count})
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Create poll button / form */}
      {!poll && user && (
        <>
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors pt-2"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Add a poll
            </button>
          ) : (
            <div className="pt-3 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Create Poll</p>
                <button onClick={() => setCreating(false)} className="text-muted-foreground hover:text-foreground p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground border-0 outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="space-y-2">
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions];
                        updated[i] = e.target.value;
                        setNewOptions(updated);
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 bg-muted rounded-xl px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground border-0 outline-none focus:ring-1 focus:ring-primary"
                    />
                    {newOptions.length > 2 && (
                      <button onClick={() => removeOption(i)} className="text-muted-foreground hover:text-destructive p-1">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                {newOptions.length < 5 && (
                  <button onClick={addOption} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                    <Plus className="h-3 w-3" /> Add option
                  </button>
                )}
                <Button size="sm" onClick={createPoll} disabled={submitting} className="gradient-hero text-primary-foreground rounded-xl ml-auto">
                  {submitting ? 'Creating...' : 'Create Poll'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
