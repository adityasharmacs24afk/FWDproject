import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(searchParams.get('tab') === 'signup');
  
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'founder',
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    setLoading(false);
    if (!error) {
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.fullName,
      signUpData.role
    );
    setLoading(false);
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 items-center justify-center p-12">
        <div className="text-left">
          <h1 className="text-7xl font-black text-black mb-4 leading-tight">
            PITCH<span className="text-black"> &gt;&gt;</span>
            <br />
            <span className="text-purple-900">SPHERE</span>
          </h1>
          <p className="text-white text-sm tracking-widest mt-8">CREATE. EMPOWER. SUSTAINABLY.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-right mb-8">
            <span className="text-3xl font-bold text-black">&gt; &gt;</span>
          </div>

          {/* Header */}
          <h2 className="text-center font-bold text-xl mb-6">
            {isSignUp ? 'GET STARTED TODAY !' : 'SIGN IN TO CONTINUE'}
          </h2>

          {/* Role Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setSignUpData({ ...signUpData, role: 'investor' })}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                signUpData.role === 'investor'
                  ? 'bg-accent text-white'
                  : 'bg-transparent border-2 border-foreground/20 text-foreground hover:border-accent'
              }`}
            >
              INVESTOR
            </button>
            <button
              type="button"
              onClick={() => setSignUpData({ ...signUpData, role: 'founder' })}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                signUpData.role === 'founder'
                  ? 'bg-accent text-white'
                  : 'bg-transparent border-2 border-foreground/20 text-foreground hover:border-accent'
              }`}
            >
              FOUNDER
            </button>
          </div>

          {/* Sign In Form */}
          {!isSignUp ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                type="email"
                placeholder="ENTER EMAIL OR USERNAME"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                className="h-14 rounded-full px-6 text-sm uppercase placeholder:text-muted-foreground"
                required
              />
              <Input
                type="password"
                placeholder="ENTER PASSWORD"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                className="h-14 rounded-full px-6 text-sm uppercase placeholder:text-muted-foreground"
                required
              />
              <Button
                type="submit"
                variant="accent"
                className="w-auto px-8 h-12 rounded-lg ml-auto block uppercase font-bold"
                disabled={loading}
              >
                {loading ? 'PROCEEDING...' : 'PROCEED'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                type="text"
                placeholder="ENTER FULL NAME"
                value={signUpData.fullName}
                onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                className="h-14 rounded-full px-6 text-sm uppercase placeholder:text-muted-foreground"
                required
              />
              <Input
                type="email"
                placeholder="ENTER EMAIL"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="h-14 rounded-full px-6 text-sm uppercase placeholder:text-muted-foreground"
                required
              />
              <Input
                type="password"
                placeholder="ENTER PASSWORD"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="h-14 rounded-full px-6 text-sm uppercase placeholder:text-muted-foreground"
                required
                minLength={6}
              />
              <Button
                type="submit"
                variant="accent"
                className="w-full h-12 rounded-lg uppercase font-bold"
                disabled={loading}
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Button>
            </form>
          )}

          {/* Toggle between Sign In/Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-sm mb-4 font-medium">
              {isSignUp ? 'ALREADY HAVE AN ACCOUNT ?' : 'OR GET STARTED TODAY !'}
            </p>
            {isSignUp ? (
              <Button
                type="button"
                onClick={() => setIsSignUp(false)}
                variant="outline"
                className="w-full h-12 rounded-lg uppercase font-bold border-2"
              >
                SIGN IN
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  variant="accent"
                  className="flex-1 h-12 rounded-lg uppercase font-bold"
                >
                  JOIN AS FOUNDER
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  variant="outline"
                  className="flex-1 h-12 rounded-lg uppercase font-bold border-2 hover:underline"
                >
                  JOIN AS INVESTOR
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
