import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Trash2, Mail, Smartphone, TrendingDown, Search, Calendar, ArrowLeft, Plane } from 'lucide-react';
import { formatINR } from '../../utils/indian-locale';
import { FLIGHT_DATABASE } from '../../utils/flight-data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Alert {
  id: string;
  route: string;
  from: string;
  to: string;
  targetPrice: number;
  currentPrice: number;
  priceChange: number;
  dateRange: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  active: boolean;
}

// Start with empty alerts - users should create their own alerts
// This ensures new signups don't have pre-populated demo data
const DEFAULT_ALERTS: Alert[] = [];

export default function Alerts() {
  const context = useContext(AppContext);
  const { accessToken } = context || {};

  // Load alerts from localStorage or use empty array
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const savedAlerts = localStorage.getItem('skysmart_alerts');
    if (savedAlerts) {
      try {
        return JSON.parse(savedAlerts);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('skysmart_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const [newAlert, setNewAlert] = useState({
    from: '',
    to: '',
    targetPrice: '',
    dateRange: '',
    emailEnabled: true,
    pushEnabled: false,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateAlert = async () => {
    if (!newAlert.from || !newAlert.to || !newAlert.targetPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // In a real app, this would send to backend
      const alert: Alert = {
        id: Date.now().toString(),
        route: `${newAlert.from} → ${newAlert.to}`,
        from: newAlert.from,
        to: newAlert.to,
        targetPrice: parseFloat(newAlert.targetPrice),
        currentPrice: parseFloat(newAlert.targetPrice) + 50,
        priceChange: 0,
        dateRange: newAlert.dateRange,
        emailEnabled: newAlert.emailEnabled,
        pushEnabled: newAlert.pushEnabled,
        active: true,
      };

      setAlerts([...alerts, alert]);
      setNewAlert({
        from: '',
        to: '',
        targetPrice: '',
        dateRange: '',
        emailEnabled: true,
        pushEnabled: false,
      });
      setDialogOpen(false);
      toast.success('Price alert created successfully!');
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Failed to create alert');
    }
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast.success('Alert deleted');
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  const handleToggleNotification = (id: string, type: 'email' | 'push') => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              [type === 'email' ? 'emailEnabled' : 'pushEnabled']:
                type === 'email' ? !alert.emailEnabled : !alert.pushEnabled,
            }
          : alert
      )
    );
    toast.success('Notification settings updated');
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-foreground mb-2">Price Alerts</h1>
            <p className="text-muted-foreground">
              Get notified when prices drop on your favorite routes
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="from"
                        placeholder="New York"
                        value={newAlert.from}
                        onChange={(e) => setNewAlert({ ...newAlert, from: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="to"
                        placeholder="Paris"
                        value={newAlert.to}
                        onChange={(e) => setNewAlert({ ...newAlert, to: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetPrice">Target Price (₹)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    placeholder="20000"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Travel Dates (Optional)</Label>
                  <Input
                    id="dateRange"
                    placeholder="Dec 2025"
                    value={newAlert.dateRange}
                    onChange={(e) => setNewAlert({ ...newAlert, dateRange: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Notification Preferences</Label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">Email Notifications</span>
                    </div>
                    <Switch
                      checked={newAlert.emailEnabled}
                      onCheckedChange={(checked) =>
                        setNewAlert({ ...newAlert, emailEnabled: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">Push Notifications</span>
                    </div>
                    <Switch
                      checked={newAlert.pushEnabled}
                      onCheckedChange={(checked) =>
                        setNewAlert({ ...newAlert, pushEnabled: checked })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleCreateAlert} className="w-full bg-accent hover:bg-accent/90">
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Card */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground mb-2">How Price Alerts Work</h3>
                <p className="text-muted-foreground">
                  Set your target price for any route, and we'll monitor prices 24/7. When flights drop
                  below your target, you'll get an instant notification via email or push notification.
                  Our AI continuously analyzes price trends to help you book at the best time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card
                key={alert.id}
                className={`transition-all ${alert.active ? 'hover:shadow-lg' : 'opacity-60'}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-foreground">{alert.route}</h3>
                        {alert.priceChange < 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {Math.abs(alert.priceChange)}% lower
                          </Badge>
                        )}
                        {!alert.active && <Badge variant="secondary">Paused</Badge>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-muted-foreground mb-1">Target Price</p>
                          <p className="text-foreground">{formatINR(alert.targetPrice)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Current Price</p>
                          <p className="text-foreground">{formatINR(alert.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Travel Dates</p>
                          <p className="text-foreground">{alert.dateRange || 'Flexible'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {alert.emailEnabled ? (
                            <Mail className="w-4 h-4 text-primary" />
                          ) : (
                            <Mail className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-muted-foreground">Email</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {alert.pushEnabled ? (
                            <Smartphone className="w-4 h-4 text-primary" />
                          ) : (
                            <Smartphone className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-muted-foreground">Push</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => handleToggleAlert(alert.id)}
                        className="w-full sm:w-auto"
                      >
                        {alert.active ? 'Pause' : 'Resume'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="w-full sm:w-auto text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-foreground mb-2">No Active Alerts</h3>
              <p className="text-muted-foreground mb-6">
                Create your first price alert and never miss a great deal
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-accent hover:bg-accent/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}