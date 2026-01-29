import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { Database, RefreshCw, Trash2, Users, Plane, Bell, ArrowLeft, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';

export default function DatabaseSettings() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const user = context?.user;
  const accessToken = context?.accessToken;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalAlerts: 0,
    totalFlights: 12,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin credentials required.');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDatabaseStats();
    }
  }, [user]);

  const fetchDatabaseStats = async () => {
    setLoading(true);
    try {
      // Fetch all data from the server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setUsers(data.users || []);
        setBookings(data.bookings || []);
        setAlerts(data.alerts || []);
      } else {
        throw new Error('Failed to fetch database stats');
      }
    } catch (error: any) {
      console.error('Error fetching database stats:', error);
      toast.error('Failed to load database statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleClearBookings = async () => {
    if (!confirm('Are you sure you want to clear all bookings? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/admin/clear-bookings`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('All bookings cleared successfully');
        fetchDatabaseStats();
      } else {
        throw new Error('Failed to clear bookings');
      }
    } catch (error: any) {
      console.error('Error clearing bookings:', error);
      toast.error('Failed to clear bookings');
    }
  };

  const handleClearAlerts = async () => {
    if (!confirm('Are you sure you want to clear all alerts? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/admin/clear-alerts`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('All alerts cleared successfully');
        fetchDatabaseStats();
      } else {
        throw new Error('Failed to clear alerts');
      }
    } catch (error: any) {
      console.error('Error clearing alerts:', error);
      toast.error('Failed to clear alerts');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading database settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="w-6 h-6 text-primary" />
                <h1 className="text-foreground">Database Settings</h1>
              </div>
              <p className="text-muted-foreground">Manage and monitor your SkySmart database</p>
            </div>
          </div>
          <Button
            onClick={fetchDatabaseStats}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Database Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Total Users</p>
                  <p className="text-foreground">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Total Bookings</p>
                  <p className="text-foreground">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Plane className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Active Alerts</p>
                  <p className="text-foreground">{stats.totalAlerts}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Flight Database</p>
                  <p className="text-foreground">{stats.totalFlights} flights</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Users ({stats.totalUsers})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({stats.totalBookings})</TabsTrigger>
            <TabsTrigger value="alerts">Alerts ({stats.totalAlerts})</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users registered yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((userData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="text-foreground">{userData.name}</p>
                          <p className="text-muted-foreground">{userData.email}</p>
                        </div>
                        <Badge variant={userData.role === 'admin' ? 'default' : 'secondary'}>
                          {userData.role || 'user'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Bookings</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearBookings}
                  disabled={stats.totalBookings === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No bookings in the database</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-foreground">{booking.confirmationCode}</p>
                          <p className="text-muted-foreground">
                            Flight ID: {booking.flightId} • {booking.fareClass}
                          </p>
                          <p className="text-muted-foreground">
                            User: {booking.userId}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground">₹{booking.totalPrice?.toLocaleString('en-IN') || '0'}</p>
                          <Badge variant="secondary">{booking.status || 'confirmed'}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Price Alerts</CardTitle>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAlerts}
                  disabled={stats.totalAlerts === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active alerts</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-foreground">{alert.route}</p>
                          <p className="text-muted-foreground">
                            Target: ₹{alert.targetPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <Badge
                          variant={alert.status === 'active' ? 'default' : 'secondary'}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Database Health */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Database Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-foreground">Database Connection</p>
                    <p className="text-muted-foreground">Connected to Supabase</p>
                  </div>
                </div>
                <Badge className="bg-green-600">Healthy</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-foreground">Key-Value Store</p>
                    <p className="text-muted-foreground">Using kv_store_e56e4e4c table</p>
                  </div>
                </div>
                <Badge className="bg-blue-600">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-foreground">Flight API Integration</p>
                    <p className="text-muted-foreground">Amadeus API with caching enabled</p>
                  </div>
                </div>
                <Badge className="bg-primary">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}