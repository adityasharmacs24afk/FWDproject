import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Eye, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      
      setProfile(profileData);

      if (profileData?.role === 'founder') {
        // Load founder's ideas
        const { data: ideasData } = await supabase
          .from('ideas')
          .select('*')
          .eq('founder_id', user!.id)
          .order('created_at', { ascending: false });
        
        setIdeas(ideasData || []);
      } else if (profileData?.role === 'investor') {
        // Load investor's interests
        const { data: interestsData } = await supabase
          .from('investment_interests')
          .select('*, ideas(*)')
          .eq('investor_id', user!.id)
          .order('created_at', { ascending: false });
        
        setInvestments(interestsData || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name}</h1>
          <p className="text-muted-foreground capitalize">{profile?.role} Dashboard</p>
        </div>
        {profile?.role === 'founder' && (
          <Button variant="accent" onClick={() => navigate('/ideas/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Idea
          </Button>
        )}
      </div>

      {profile?.role === 'founder' ? (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ideas.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Upvotes</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ideas.reduce((sum, idea) => sum + idea.upvotes, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ideas.reduce((sum, idea) => sum + idea.view_count, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              {ideas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No ideas yet</p>
                  <Button variant="accent" onClick={() => navigate('/ideas/new')}>
                    Create Your First Idea
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/ideas/${idea.id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{idea.title}</h3>
                        <span className="text-sm text-muted-foreground capitalize">{idea.stage}</span>
                      </div>
                      <p className="text-muted-foreground mb-3">{idea.short_description}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>👍 {idea.upvotes}</span>
                        <span>👁️ {idea.view_count}</span>
                        <span className="capitalize">{idea.industry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ideas Interested In</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investments.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {investments.filter((i) => i.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Investment Interests</CardTitle>
            </CardHeader>
            <CardContent>
              {investments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No investments yet</p>
                  <Button variant="accent" onClick={() => navigate('/ideas')}>
                    Explore Ideas
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div
                      key={investment.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/ideas/${investment.idea_id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{investment.ideas.title}</h3>
                        <span className={`text-sm px-2 py-1 rounded ${
                          investment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          investment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {investment.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{investment.ideas.short_description}</p>
                      {investment.amount && (
                        <p className="text-sm font-medium">Amount: ${investment.amount.toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
