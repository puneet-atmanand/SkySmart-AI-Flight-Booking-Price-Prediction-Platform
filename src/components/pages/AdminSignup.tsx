import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { Mail, Lock, User, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export default function AdminSignup() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { supabase, setUser, setAccessToken } = context || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    adminCode: '', // Secret admin code
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    // Simple admin code verification (in production, use a more secure method)
    if (formData.adminCode !== 'SKYSMART-ADMIN-2025') {
      toast.error('Invalid admin access code');
      return;
    }

    setLoading(true);

    try {
      // Call backend signup endpoint with admin role
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: 'admin', // Set role as admin
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Admin signup API error:', error);
        throw new Error(error.error || error.message || 'Failed to create admin account');
      }

      const result = await response.json();
      console.log('Admin signup successful:', result);

      // Auto-login after signup
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.session && setUser && setAccessToken) {
        setAccessToken(data.session.access_token);
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: formData.name,
          role: 'admin',
        };
        setUser(userData);
        toast.success('Admin account created successfully!');
        navigate('/admin/settings');
      }
    } catch (error: any) {
      console.error('Admin signup error:', error);
      toast.error(error.message || 'Failed to create admin account. Please try again.');
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
          <CardTitle>Create Admin Account</CardTitle>
          <p className="text-muted-foreground">Set up your administrator access</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@skysmart.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminCode">Admin Access Code</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="adminCode"
                  type="text"
                  placeholder="Enter admin code"
                  value={formData.adminCode}
                  onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Contact your system administrator for the access code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
              />
              <label
                htmlFor="terms"
                className="text-muted-foreground cursor-pointer"
              >
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Admin Account...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Create Admin Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <Shield className="w-4 h-4 inline mr-1" />
              <strong>Admin Code:</strong> SKYSMART-ADMIN-2025
            </p>
            <p className="text-amber-600 text-xs mt-1">
              (For development/testing only - remove in production)
            </p>
          </div>

          <p className="text-center text-muted-foreground mt-6">
            Already have an admin account?{' '}
            <Link to="/admin/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-muted-foreground mt-2">
            <Link to="/login" className="text-muted-foreground hover:text-primary text-sm">
              ← Back to User Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
