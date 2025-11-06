import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, DollarSign, Users, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function IdeaDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentMessage, setInvestmentMessage] = useState('');

  useEffect(() => {
    loadIdeaDetail();
    if (user) {
      loadUserProfile();
      loadUserVote();
    }
  }, [id, user]);

  const loadIdeaDetail = async () => {
    try {
      const { data: ideaData, error: ideaError } = await supabase
        .from('ideas')
        .select('*, profiles(full_name, company_name, role)')
        .eq('id', id)
        .single();

      if (ideaError) throw ideaError;
      setIdea(ideaData);

      const { data: commentsData } = await supabase
        .from('idea_comments')
        .select('*, profiles(full_name)')
        .eq('idea_id', id)
        .order('created_at', { ascending: false });

      setComments(commentsData || []);
    } catch (error) {
      console.error('Error loading idea:', error);
      toast.error('Failed to load idea');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();
    setProfile(data);
  };

  const loadUserVote = async () => {
    const { data } = await supabase
      .from('idea_votes')
      .select('vote_type')
      .eq('idea_id', id)
      .eq('user_id', user!.id)
      .single();
    
    setUserVote(data?.vote_type || null);
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      navigate('/auth');
      return;
    }

    try {
      if (userVote === voteType) {
        await supabase
          .from('idea_votes')
          .delete()
          .eq('idea_id', id)
          .eq('user_id', user.id);
        setUserVote(null);
      } else {
        await supabase
          .from('idea_votes')
          .upsert({
            idea_id: id,
            user_id: user.id,
            vote_type: voteType,
          });
        setUserVote(voteType);
      }
      loadIdeaDetail();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment');
      navigate('/auth');
      return;
    }

    try {
      await supabase.from('idea_comments').insert({
        idea_id: id,
        user_id: user.id,
        comment: newComment,
      });

      setNewComment('');
      loadIdeaDetail();
      toast.success('Comment added');
    } catch (error) {
      console.error('Error commenting:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleExpressInterest = async () => {
    if (!user) {
      toast.error('Please sign in to express interest');
      navigate('/auth');
      return;
    }

    try {
      await supabase.from('investment_interests').insert({
        idea_id: id,
        investor_id: user.id,
        founder_id: idea.founder_id,
        amount: investmentAmount ? parseFloat(investmentAmount) : null,
        message: investmentMessage,
      });

      toast.success('Interest expressed successfully!');
      setInvestmentAmount('');
      setInvestmentMessage('');
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast.error('Failed to express interest');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-96 mb-8" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Idea not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/ideas')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Ideas
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{idea.title}</h1>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary">{idea.industry}</Badge>
                <Badge variant="outline" className="capitalize">{idea.stage}</Badge>
              </div>
              <p className="text-muted-foreground">
                by {idea.profiles.full_name}
                {idea.profiles.company_name && ` • ${idea.profiles.company_name}`}
              </p>
            </div>
            {idea.image_url && (
              <img 
                src={idea.image_url} 
                alt={idea.title}
                className="w-32 h-32 object-cover rounded-lg ml-6"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button
              variant={userVote === 'up' ? 'accent' : 'outline'}
              onClick={() => handleVote('up')}
              className="flex-1"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Upvote ({idea.upvotes})
            </Button>
            <Button
              variant={userVote === 'down' ? 'destructive' : 'outline'}
              onClick={() => handleVote('down')}
              className="flex-1"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Downvote ({idea.downvotes})
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{idea.full_description}</p>
          </div>

          {idea.funding_goal && (
            <div className="p-4 border rounded-lg bg-accent/5">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-5 h-5 text-accent" />
                <span className="font-semibold">Funding Goal</span>
              </div>
              <p className="text-2xl font-bold text-accent">${idea.funding_goal.toLocaleString()}</p>
            </div>
          )}

          {profile?.role === 'investor' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="accent" className="w-full" size="lg">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Express Investment Interest
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Express Interest in {idea.title}</DialogTitle>
                  <DialogDescription>
                    Let the founder know you're interested in investing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount (optional)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Founder</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell the founder why you're interested..."
                      value={investmentMessage}
                      onChange={(e) => setInvestmentMessage(e.target.value)}
                    />
                  </div>
                  <Button variant="accent" className="w-full" onClick={handleExpressInterest}>
                    Submit Interest
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Comments & Feedback</h3>
            
            {user && (
              <form onSubmit={handleComment} className="space-y-3">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <Button type="submit" variant="accent">Post Comment</Button>
              </form>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold">{comment.profiles.full_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.comment}</p>
                  </CardContent>
                </Card>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No comments yet. Be the first to share feedback!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
