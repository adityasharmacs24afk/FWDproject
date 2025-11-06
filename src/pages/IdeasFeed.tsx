import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ThumbsUp, ThumbsDown, Eye, Search, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function IdeasFeed() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [industryFilter, setIndustryFilter] = useState('all');

  useEffect(() => {
    loadIdeas();
  }, [sortBy]);

  const loadIdeas = async () => {
    try {
      let query = supabase
        .from('ideas')
        .select('*, profiles(full_name, company_name)');

      if (sortBy === 'popular') {
        query = query.order('upvotes', { ascending: false });
      } else if (sortBy === 'trending') {
        query = query.order('view_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error loading ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'all' || idea.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(ideas.map(idea => idea.industry))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Startup Ideas</h1>
        <p className="text-muted-foreground">Discover innovative ideas and connect with founders</p>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map(industry => (
              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {filteredIdeas.map((idea) => (
          <Card 
            key={idea.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/ideas/${idea.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{idea.title}</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    by {idea.profiles.full_name}
                    {idea.profiles.company_name && ` • ${idea.profiles.company_name}`}
                  </p>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="secondary">{idea.industry}</Badge>
                    <Badge variant="outline" className="capitalize">{idea.stage}</Badge>
                  </div>
                </div>
                {idea.image_url && (
                  <img 
                    src={idea.image_url} 
                    alt={idea.title}
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{idea.short_description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{idea.upvotes}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsDown className="w-4 h-4" />
                  <span>{idea.downvotes}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{idea.view_count}</span>
                </div>
                {idea.funding_goal && (
                  <div className="ml-auto font-medium text-accent">
                    Goal: ${idea.funding_goal.toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredIdeas.length === 0 && (
          <Card className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
