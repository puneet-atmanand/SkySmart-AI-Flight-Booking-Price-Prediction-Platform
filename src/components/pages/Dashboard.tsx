import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { Plane, Calendar, Bell, TrendingDown, Download, MapPin, Clock } from 'lucide-react';
import { formatINR } from '../../utils/indian-locale';
import { FLIGHT_DATABASE } from '../../utils/flight-data';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

export default function Dashboard() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const user = context?.user;
  const accessToken = context?.accessToken;

  const [upcomingFlights, setUpcomingFlights] = useState<any[]>([]);
  const [pastFlights, setPastFlights] = useState<any[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user bookings
        const bookingsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/user/bookings`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (bookingsResponse.ok) {
          const { bookings } = await bookingsResponse.json();
          
          // Separate upcoming and past flights based on date
          const now = new Date();
          const upcoming: any[] = [];
          const past: any[] = [];

          bookings.forEach((booking: any) => {
            // Get flight details from FLIGHT_DATABASE
            const flightDetails = FLIGHT_DATABASE.find(f => f.id === booking.flightId);
            
            if (flightDetails) {
              const bookingWithFlight = {
                ...booking,
                flight: flightDetails,
              };
              
              // For simplicity, consider all bookings as upcoming for now
              // In production, you'd parse the flight date properly
              upcoming.push(bookingWithFlight);
            }
          });

          // Add two mock past trips to justify Total Savings of Rs.19,090
          const mockPastTrips = [
            {
              id: 'past_1',
              flight: FLIGHT_DATABASE[0], // IndiGo Delhi-Mumbai
              fareClass: 'Economy',
              passenger: { firstName: user.name || 'Traveler', lastName: '' },
              totalPrice: 4850,
              originalPrice: 5500, // Saved 650
              savings: 650,
              status: 'completed',
              date: 'Nov 10, 2025',
              confirmationCode: 'SKY-PAST01',
            },
            {
              id: 'past_2',
              flight: FLIGHT_DATABASE[4], // Emirates Delhi-Dubai
              fareClass: 'Business',
              passenger: { firstName: user.name || 'Traveler', lastName: '' },
              totalPrice: 32500,
              originalPrice: 51440, // Saved 18,440
              savings: 18440,
              status: 'completed',
              date: 'Oct 28, 2025',
              confirmationCode: 'SKY-PAST02',
            },
          ];

          setUpcomingFlights(upcoming);
          setPastFlights(mockPastTrips);
        }

        // Fetch user alerts
        const alertsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/user/alerts`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (alertsResponse.ok) {
          const { alerts } = await alertsResponse.json();
          setActiveAlerts(alerts || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Welcome back, {user?.name || 'Traveler'}!</h1>
          <p className="text-muted-foreground">Manage your flights, alerts, and preferences</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Upcoming Trips</p>
                  <p className="text-foreground">{upcomingFlights.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Plane className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Active Alerts</p>
                  <p className="text-foreground">{activeAlerts.length}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">Total Savings</p>
                  <p className="text-foreground">{formatINR(19090)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
            <TabsTrigger value="past">Past Trips</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          {/* Upcoming Trips */}
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingFlights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Plane className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-foreground">{flight.flight.airline}</p>
                              <p className="text-muted-foreground">{flight.flight.flightNumber}</p>
                            </div>
                          </div>
                          <Badge
                            className={
                              flight.flight.status === 'On Time'
                                ? 'bg-green-600'
                                : 'bg-primary'
                            }
                          >
                            {flight.flight.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-muted-foreground mb-1">From</p>
                            <p className="text-foreground">{flight.flight.from}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">To</p>
                            <p className="text-foreground">{flight.flight.to}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Departure</p>
                            <p className="text-foreground">{flight.flight.departure}</p>
                            <p className="text-muted-foreground">{flight.flight.date}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Gate</p>
                            <p className="text-foreground">{flight.flight.departureDetails?.gate || 'TBD'}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-muted-foreground">
                            Confirmation: <span className="text-foreground">{flight.confirmationCode}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          onClick={() => navigate(`/booking/confirmation/${flight.id}`)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          View Details
                        </Button>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Ticket
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/status')}>
                          <Clock className="w-4 h-4 mr-2" />
                          Track Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {upcomingFlights.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-foreground mb-2">No upcoming trips</h3>
                    <p className="text-muted-foreground mb-6">
                      Ready to plan your next adventure?
                    </p>
                    <Button onClick={() => navigate('/flights/search')} className="bg-accent hover:bg-accent/90">
                      Search Flights
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Past Trips */}
          <TabsContent value="past">
            <div className="space-y-4">
              {pastFlights.map((flight) => (
                <Card key={flight.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-foreground">{flight.flight.airline} • {flight.flight.flightNumber}</p>
                          <p className="text-muted-foreground">{flight.flight.from} → {flight.flight.to.split('(')[0]}</p>
                          <p className="text-muted-foreground">{flight.flight.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{flight.flight.status}</Badge>
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Price Alerts */}
          <TabsContent value="alerts">
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <Bell className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-foreground">{alert.route}</p>
                          <p className="text-muted-foreground">
                            Target: {formatINR(alert.targetPrice)} • Current: {formatINR(alert.currentPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {Math.abs(alert.priceChange)}% lower
                        </Badge>
                        <Button variant="outline" onClick={() => navigate('/alerts')}>
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-foreground mb-2">Create a Price Alert</h3>
                  <p className="text-muted-foreground mb-6">
                    Get notified when prices drop on your favorite routes
                  </p>
                  <Button onClick={() => navigate('/alerts')} className="bg-accent hover:bg-accent/90">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Up Alert
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}