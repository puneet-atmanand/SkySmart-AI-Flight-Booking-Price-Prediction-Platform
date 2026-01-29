import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';

export default function AdminLogin() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { supabase, setUser, setAccessToken } = context || {};

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Admin login attempt:', { hasData: !!data, hasError: !!error });
      
      if (error) {
        console.error('Admin login error from Supabase:', error);
        throw error;
      }

      if (data.session && setUser && setAccessToken) {
        // Check if user is admin
        const isAdmin = data.user.user_metadata?.role === 'admin';
        
        if (!isAdmin) {
          toast.error('Access denied. Admin credentials required.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        setAccessToken(data.session.access_token);
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          role: 'admin',
        };
        setUser(userData);
        toast.success('Welcome Admin!');
        
        navigate('/admin/database');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Admin Portal</CardTitle>
          <p className="text-muted-foreground">Sign in to access the database settings</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@skysmart.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In as Admin
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-accent text-center">
              <Shield className="w-4 h-4 inline mr-2" />
              Admin access only
            </p>
          </div>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an admin account?{' '}
            <Link to="/admin/signup" className="text-primary hover:underline">
              Create Admin Account
            </Link>
          </p>

          <p className="text-center text-muted-foreground mt-2">
            Not an admin?{' '}
            <Link to="/login" className="text-primary hover:underline">
              User Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}