import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Database, Users, Plane, Bell, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import DatabaseStatus from '../DatabaseStatus';

export default function DatabaseAdmin() {
  const context = useContext(AppContext);
  const { user, accessToken } = context || {};
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      // Fetch user's bookings
      const bookingsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/user/bookings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      // Fetch user's alerts
      const alertsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/user/alerts`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData.alerts || []);
      }

      toast.success('Data fetched successfully');
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/alerts/${alertId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== alertId));
        toast.success('Alert deleted successfully');
      } else {
        toast.error('Failed to delete alert');
      }
    } catch (error: any) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      fetchAllData();
    }
  }, [user, accessToken]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Database Administration</h1>
        </div>
        <p className="text-muted-foreground">
          Monitor and manage your SkySmart database connection and data
        </p>
      </div>

      {/* Database Connection Status */}
      <div className="mb-8">
        <DatabaseStatus />
      </div>

      {/* User Data Management */}
      {user && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Database Records
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAllData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
                <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">User ID</Label>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <Label className="text-xs text-muted-foreground">Database Table</Label>
                    <p className="font-mono text-sm">kv_store_e56e4e4c</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Storage Key</Label>
                    <p className="font-mono text-sm">user:{user.id}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plane className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No bookings found in database</p>
                    <p className="text-sm mt-1">Book a flight to see records here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Confirmation: {booking.confirmationCode}</p>
                            <p className="text-sm text-muted-foreground">Flight: {booking.flightId}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs">
                            {booking.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">Passenger</Label>
                            <p>{booking.passenger?.name}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Fare Class</Label>
                            <p>{booking.fareClass}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Total Price</Label>
                            <p className="font-medium">₹{booking.totalPrice?.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Created</Label>
                            <p>{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t mt-2">
                          <Label className="text-xs text-muted-foreground">Database Key</Label>
                          <p className="font-mono text-xs">booking:{booking.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No price alerts found in database</p>
                    <p className="text-sm mt-1">Create a price alert to see records here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{alert.from} → {alert.to}</p>
                            <p className="text-sm text-muted-foreground">Target: ₹{alert.targetPrice?.toLocaleString('en-IN')}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">Date</Label>
                            <p>{alert.date}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <p>{alert.active ? '🟢 Active' : '⚪ Inactive'}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t mt-2">
                          <Label className="text-xs text-muted-foreground">Database Key</Label>
                          <p className="font-mono text-xs">alert:{alert.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Login Required</h3>
            <p className="text-muted-foreground mb-4">
              Please login to view and manage your database records
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
