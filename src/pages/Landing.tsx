import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Rocket, TrendingUp, Users, Lightbulb, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Pitch Your Startup,
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent"> Get Funded</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with investors, collaborate with founders, and turn your ideas into reality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?tab=signup">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/ideas">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Ideas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose StartupHub?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Launch Your Idea</h3>
              <p className="text-muted-foreground">
                Submit your startup idea with pitch decks, videos, and comprehensive details to attract the right investors.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Discovered</h3>
              <p className="text-muted-foreground">
                Get upvoted by the community, receive feedback, and gain visibility among active investors.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Collaborate</h3>
              <p className="text-muted-foreground">
                Network with fellow founders, find co-founders, and collaborate on exciting projects.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-accent/20">
            <Lightbulb className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Startup?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of founders and investors building the future
            </p>
            <Link to="/auth?tab=signup">
              <Button variant="accent" size="lg">
                Create Free Account
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
