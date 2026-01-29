import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plane, Clock, Calendar, Shield, Wifi, Monitor, Utensils, TrendingDown, Star, ArrowLeft } from 'lucide-react';
import { formatINR } from '../../utils/indian-locale';
import { FLIGHT_DATABASE } from '../../utils/flight-data';
import { AppContext } from '../../App';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function FlightDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const context = useContext(AppContext);
  const user = context?.user;

  // Get flight data from FLIGHT_DATABASE based on ID
  const flightData = FLIGHT_DATABASE.find(f => f.id === id);

  // If flight not found, show error
  if (!flightData) {
    return (
      <div className="min-h-screen bg-secondary/20 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-foreground mb-2">Flight Not Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find the flight you're looking for.
              </p>
              <Button onClick={() => navigate('/flights/search')} className="bg-primary hover:bg-primary/90">
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Map flight data to display format
  const flight = {
    id: flightData.id,
    airline: flightData.airline,
    flightNumber: flightData.flightNumber,
    from: `${flightData.from} (${flightData.departureDetails.airport.split(' ').pop()?.replace(/[()]/g, '')})`,
    to: `${flightData.to} (${flightData.arrivalDetails.airport.split(' ').pop()?.replace(/[()]/g, '')})`,
    departure: flightData.departure,
    arrival: flightData.arrival,
    date: flightData.departureDetails.date,
    duration: flightData.duration,
    price: flightData.price,
    stops: flightData.stops,
    aircraft: flightData.aircraft,
    aiScore: flightData.aiScore,
    priceChange: flightData.priceChange,
    amenities: ['WiFi', 'In-flight Entertainment', 'Power Outlets', 'Meals Included'],
    rating: 4.5,
    reviews: 1248,
  };

  const baggageInfo = [
    { type: 'Carry-on', weight: '10 kg', description: '1 bag + 1 personal item' },
    { type: 'Checked (Economy)', weight: '23 kg', description: '1 bag included' },
    { type: 'Checked (Business)', weight: '32 kg', description: '2 bags included' },
  ];

  const fareClasses = [
    {
      name: 'Economy',
      price: 40500,
      features: ['Standard seat', '1 checked bag', 'Meals included', 'No changes'],
    },
    {
      name: 'Premium Economy',
      price: 65500,
      features: ['Extra legroom', '2 checked bags', 'Priority boarding', 'Free changes'],
      popular: true,
    },
    {
      name: 'Business',
      price: 157500,
      features: ['Lie-flat seat', '3 checked bags', 'Lounge access', 'Free changes & cancellations'],
    },
  ];

  const handleBook = (fareClass: string, price: number) => {
    if (!user) {
      navigate(`/login?redirect=/flights/details/${id}`);
      return;
    }
    navigate(`/booking/${id}?class=${fareClass}&price=${price}`);
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        {/* Flight Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-foreground">{flight.airline}</h1>
                  {flight.aiScore >= 90 && (
                    <Badge className="bg-primary">AI Top Pick</Badge>
                  )}
                  {flight.priceChange < 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {Math.abs(flight.priceChange)}% off
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Flight {flight.flightNumber} · {flight.aircraft}</p>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(flight.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground ml-2">
                    {flight.rating} ({flight.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Timeline */}
            <div className="grid grid-cols-3 gap-4 items-center mb-6">
              <div>
                <p className="text-muted-foreground">Departure</p>
                <p className="text-foreground">{flight.departure}</p>
                <p className="text-foreground">{flight.from}</p>
                <p className="text-muted-foreground">{flight.date}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-2">{flight.duration}</p>
                <div className="flex items-center justify-center">
                  <div className="h-px bg-border flex-1"></div>
                  <Plane className="w-5 h-5 mx-3 text-primary" />
                  <div className="h-px bg-border flex-1"></div>
                </div>
                <p className="text-muted-foreground mt-2">
                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">Arrival</p>
                <p className="text-foreground">{flight.arrival}</p>
                <p className="text-foreground">{flight.to}</p>
                <p className="text-muted-foreground">{flight.date}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {flight.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground mb-2">AI Booking Recommendation</h3>
                <p className="text-muted-foreground mb-2">
                  This flight is priced <strong>12% below average</strong> for this route. Historical data shows
                  prices typically increase within the next 3 days.
                </p>
                <p className="text-foreground">
                  ✓ Great value • ✓ Popular departure time • ✓ High customer rating
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="fares" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fares">Fare Options</TabsTrigger>
            <TabsTrigger value="details">Flight Details</TabsTrigger>
          </TabsList>

          <TabsContent value="fares" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fareClasses.map((fareClass) => (
                <Card key={fareClass.name} className={`relative ${fareClass.popular ? 'border-primary border-2' : ''}`}>
                  {fareClass.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-accent">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-center">
                      <p className="text-foreground">{fareClass.name}</p>
                      <p className="text-foreground mt-2">{formatINR(fareClass.price)}</p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {fareClass.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        fareClass.popular ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
                      }`}
                      onClick={() => handleBook(fareClass.name, fareClass.price)}
                    >
                      Select {fareClass.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aircraft & Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Aircraft & Amenities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-muted-foreground mb-1">Aircraft Type</p>
                    <p className="text-foreground">{flight.aircraft}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-2">Onboard Services</p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Wifi className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-foreground">In-flight WiFi ($)</span>
                      </li>
                      <li className="flex items-center">
                        <Utensils className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-foreground">Complimentary meals & drinks</span>
                      </li>
                      <li className="flex items-center">
                        <Monitor className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-foreground">Entertainment system</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Baggage Policy */}
              <Card>
                <CardHeader>
                  <CardTitle>Baggage Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {baggageInfo.map((baggage, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-foreground">{baggage.type}</p>
                        <Badge variant="secondary">{baggage.weight}</Badge>
                      </div>
                      <p className="text-muted-foreground">{baggage.description}</p>
                      {index < baggageInfo.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}