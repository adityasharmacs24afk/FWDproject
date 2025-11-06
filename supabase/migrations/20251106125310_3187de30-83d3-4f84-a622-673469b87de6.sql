-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('founder', 'investor', 'reviewer');

-- Create enum for idea stages
CREATE TYPE public.idea_stage AS ENUM ('idea', 'mvp', 'scaling', 'established');

-- Create enum for investment status
CREATE TYPE public.investment_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  company_name TEXT,
  bio TEXT,
  linkedin_url TEXT,
  location TEXT,
  investment_range TEXT,
  industries_of_interest TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create ideas table
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  industry TEXT NOT NULL,
  stage idea_stage NOT NULL DEFAULT 'idea',
  funding_goal NUMERIC,
  pitch_deck_url TEXT,
  video_url TEXT,
  image_url TEXT,
  team_members TEXT[],
  website_url TEXT,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create idea_votes table
CREATE TABLE public.idea_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(idea_id, user_id)
);

-- Create idea_comments table
CREATE TABLE public.idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create investment_interests table
CREATE TABLE public.investment_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC,
  message TEXT,
  status investment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(idea_id, investor_id)
);

-- Create collaborations table
CREATE TABLE public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collaborator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Anyone can view published ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Founders can create ideas" ON public.ideas FOR INSERT WITH CHECK (auth.uid() = founder_id);
CREATE POLICY "Founders can update own ideas" ON public.ideas FOR UPDATE USING (auth.uid() = founder_id);
CREATE POLICY "Founders can delete own ideas" ON public.ideas FOR DELETE USING (auth.uid() = founder_id);

-- Votes policies
CREATE POLICY "Users can view all votes" ON public.idea_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON public.idea_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON public.idea_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.idea_votes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.idea_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.idea_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.idea_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.idea_comments FOR DELETE USING (auth.uid() = user_id);

-- Investment interests policies
CREATE POLICY "Founders and investors can view interests" ON public.investment_interests FOR SELECT USING (auth.uid() = founder_id OR auth.uid() = investor_id);
CREATE POLICY "Investors can express interest" ON public.investment_interests FOR INSERT WITH CHECK (auth.uid() = investor_id);
CREATE POLICY "Investors can update own interests" ON public.investment_interests FOR UPDATE USING (auth.uid() = investor_id);
CREATE POLICY "Founders can update interest status" ON public.investment_interests FOR UPDATE USING (auth.uid() = founder_id);

-- Collaborations policies
CREATE POLICY "Users can view their collaborations" ON public.collaborations FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = collaborator_id);
CREATE POLICY "Users can request collaborations" ON public.collaborations FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update collaboration status" ON public.collaborations FOR UPDATE USING (auth.uid() = collaborator_id OR auth.uid() = requester_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'founder')
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update vote counts
CREATE OR REPLACE FUNCTION public.update_idea_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE public.ideas SET upvotes = upvotes + 1 WHERE id = NEW.idea_id;
    ELSE
      UPDATE public.ideas SET downvotes = downvotes + 1 WHERE id = NEW.idea_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
      UPDATE public.ideas SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.idea_id;
    ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
      UPDATE public.ideas SET downvotes = downvotes - 1, upvotes = upvotes + 1 WHERE id = NEW.idea_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE public.ideas SET upvotes = upvotes - 1 WHERE id = OLD.idea_id;
    ELSE
      UPDATE public.ideas SET downvotes = downvotes - 1 WHERE id = OLD.idea_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for vote counting
CREATE TRIGGER update_idea_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.idea_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_idea_votes();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.idea_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_interests_updated_at BEFORE UPDATE ON public.investment_interests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();