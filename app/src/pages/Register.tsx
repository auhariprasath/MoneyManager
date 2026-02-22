import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Loader2 } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-neutral-950">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-neutral-900/50 border border-white/5 shadow-2xl rounded-[2.5rem] backdrop-blur-xl my-8">
        <CardHeader className="space-y-2 text-center pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-white tracking-tight">Fin<span className="text-primary">Nexus</span></CardTitle>
          <CardDescription className="text-neutral-400 font-medium tracking-wide uppercase text-[10px]">Establish Strategic Identity</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-8">
            {error && (
              <Alert className="bg-rose-500/10 border-rose-500/20 text-rose-500 rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-400 ml-1">Alias / Username</Label>
              <Input
                name="username"
                placeholder="nexus_operative"
                value={formData.username}
                onChange={handleChange}
                required
                className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-400 ml-1">Communication Vector (Email)</Label>
              <Input
                name="email"
                type="email"
                placeholder="operative@nexus.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-400 ml-1">Security Protocol (Password)</Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12 border-white/5 bg-neutral-800 rounded-xl focus:ring-primary/20 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-400 ml-1">Confirm Protocol</Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  Generating Identity...
                </>
              ) : (
                'Establish Identity'
              )}
            </Button>
            <p className="text-sm text-neutral-500 text-center">
              Existing operative?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Initialize Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
