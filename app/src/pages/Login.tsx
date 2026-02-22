import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-neutral-950">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-neutral-900/50 border border-white/5 shadow-2xl rounded-[2.5rem] backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-white tracking-tight">Fin<span className="text-primary">Nexus</span></CardTitle>
          <CardDescription className="text-neutral-400 font-medium tracking-wide uppercase text-[10px]">Secure Authentication Gateway</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-8">
            {error && (
              <Alert className="bg-rose-500/10 border-rose-500/20 text-rose-500 rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-neutral-400 ml-1">Capital Identifier</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@nexus.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-neutral-400 ml-1">Access Protocol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-10 pt-6 px-8">
            <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-bold transition-all shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Access...
                </>
              ) : (
                'Initialize Authorization'
              )}
            </Button>
            <p className="text-sm text-neutral-500 text-center">
              New operative?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Establish Identity
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
