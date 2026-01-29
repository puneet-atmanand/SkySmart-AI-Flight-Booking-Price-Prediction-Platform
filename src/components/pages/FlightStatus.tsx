import { useState } from 'react';
import { Search, Plane, Clock, MapPin, AlertCircle, CheckCircle, Calendar, Bell } from 'lucide-react';
import { FLIGHT_DATABASE, FlightData } from '../../utils/flight-data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function FlightStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'flightNumber' | 'route'>('flightNumber');
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setNotFound(false);
    
    // Simulate API call delay
    setTimeout(() => {
      // Search for flight by flight number (case insensitive, with or without spaces/dashes)
      const normalizedQuery = searchQuery.trim().toUpperCase().replace(/[\s-]/g, '');
      const foundFlight = FLIGHT_DATABASE.find(flight => 
        flight.flightNumber.replace(/[\s-]/g, '').toUpperCase() === normalizedQuery
      );
      
      if (foundFlight) {
        setFlightData(foundFlight);
      } else {
        setFlightData(null);
        setNotFound(true);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-foreground mb-2">Flight Status Tracker</h1>
          <p className="text-muted-foreground">
            Get real-time updates on flight delays, gate changes, and arrivals
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="flightNumber">Flight Number</TabsTrigger>
                <TabsTrigger value="route">Route</TabsTrigger>
              </TabsList>

              <TabsContent value="flightNumber" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flightNumber">Enter Flight Number</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="flightNumber"
                        placeholder="e.g. 6E-2045, AI-864, UK-955"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={loading} className="bg-primary hover:bg-primary/90">
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="route" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Input id="from" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input id="to" placeholder="London" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                <Button onClick={handleSearch} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search Flights
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Flight Status Display */}
        {flightData && (
          <div className="space-y-6">
            {/* Status Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-foreground">{flightData.airline}</h2>
                      <Badge
                        className={
                          flightData.status === 'On Time'
                            ? 'bg-green-600'
                            : flightData.status === 'Delayed'
                            ? 'bg-yellow-600'
                            : 'bg-primary'
                        }
                      >
                        {flightData.status === 'On Time' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {flightData.status === 'Delayed' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {flightData.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      Flight {flightData.flightNumber} • {flightData.aircraft}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Status Alert
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Flight Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Flight Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Departure */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Plane className="w-8 h-8 text-primary rotate-45" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-foreground">Departure</p>
                        <Badge variant="secondary">{flightData.status}</Badge>
                      </div>
                      <p className="text-foreground">{flightData.departure}</p>
                      <p className="text-foreground">{flightData.departureDetails.airport}</p>
                      <p className="text-muted-foreground">{flightData.departureDetails.city} • {flightData.departureDetails.date}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2 p-2 bg-secondary rounded-lg">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{flightData.departureDetails.terminal}</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-secondary rounded-lg">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">Gate {flightData.departureDetails.gate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flight Duration */}
                  <div className="flex items-center pl-8">
                    <div className="w-px h-16 bg-border mr-8"></div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Flight Duration: {flightData.duration}</span>
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-foreground">Arrival</p>
                        {flightData.delay && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            Delayed {flightData.delay}
                          </Badge>
                        )}
                      </div>
                      <p className="text-foreground">{flightData.arrival}</p>
                      <p className="text-foreground">{flightData.arrivalDetails.airport}</p>
                      <p className="text-muted-foreground">{flightData.arrivalDetails.city} • {flightData.arrivalDetails.date}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2 p-2 bg-secondary rounded-lg">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">{flightData.arrivalDetails.terminal}</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-secondary rounded-lg">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">Gate {flightData.arrivalDetails.gate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Baggage Claim</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plane className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Collection Point</p>
                      <p className="text-foreground">{flightData.baggage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weather Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Departure:</span>
                      <span className="text-foreground">Sunny, 72°F</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Arrival:</span>
                      <span className="text-foreground">Cloudy, 58°F</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {notFound && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-foreground mb-2">Flight Not Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find a flight with number "{searchQuery}". Please check the flight number and try again.
              </p>
              <p className="text-muted-foreground">
                Available flights: 6E-2045, AI-864, UK-955, SG-8194, EK-512, SQ-406, QP-1303, QR-572, LH-761, BA-142, SG-8945, AI-658
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!flightData && !loading && !notFound && (
          <Card>
            <CardContent className="p-12 text-center">
              <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-foreground mb-2">Track Your Flight</h3>
              <p className="text-muted-foreground">
                Enter a flight number or route to see real-time status updates
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
