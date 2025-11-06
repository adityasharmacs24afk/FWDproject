import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function NewIdea() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    industry: '',
    stage: 'idea',
    funding_goal: '',
    website_url: '',
    pitch_deck_url: '',
    video_url: '',
    image_url: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user is a founder
    const checkRole = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (data?.role !== 'founder') {
        toast.error('Only founders can submit ideas');
        navigate('/dashboard');
      }
    };

    checkRole();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          title: formData.title,
          short_description: formData.short_description,
          full_description: formData.full_description,
          industry: formData.industry,
          stage: formData.stage as 'idea' | 'mvp' | 'scaling' | 'established',
          founder_id: user!.id,
          funding_goal: formData.funding_goal ? parseFloat(formData.funding_goal) : null,
          website_url: formData.website_url || null,
          pitch_deck_url: formData.pitch_deck_url || null,
          video_url: formData.video_url || null,
          image_url: formData.image_url || null,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Idea submitted successfully!');
      navigate(`/ideas/${data.id}`);
    } catch (error) {
      console.error('Error submitting idea:', error);
      toast.error('Failed to submit idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Submit Your Startup Idea</CardTitle>
          <CardDescription>
            Share your vision with investors and the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Idea Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AI-Powered Task Manager"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description *</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="One-line pitch (max 100 characters)"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Full Description *</Label>
              <Textarea
                id="full_description"
                value={formData.full_description}
                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                placeholder="Describe your idea, the problem it solves, and your solution..."
                rows={8}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., FinTech, EdTech, HealthTech"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage *</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => setFormData({ ...formData, stage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="scaling">Scaling</SelectItem>
                    <SelectItem value="established">Established</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funding_goal">Funding Goal ($)</Label>
              <Input
                id="funding_goal"
                type="number"
                value={formData.funding_goal}
                onChange={(e) => setFormData({ ...formData, funding_goal: e.target.value })}
                placeholder="50000"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Additional Resources (Optional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch_deck_url">Pitch Deck URL</Label>
                <Input
                  id="pitch_deck_url"
                  type="url"
                  value={formData.pitch_deck_url}
                  onChange={(e) => setFormData({ ...formData, pitch_deck_url: e.target.value })}
                  placeholder="https://docs.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Idea'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
