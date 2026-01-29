import { useState, useContext } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AppContext } from '../../App';
import { CreditCard, User, Mail, Phone, Calendar, Shield, Lock } from 'lucide-react';
import { formatINR } from '../../utils/indian-locale';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import SeatSelector from '../SeatSelector';

export default function Booking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const context = useContext(AppContext);
  const { user, accessToken } = context || {};

  const fareClass = searchParams.get('class') || 'Economy';
  const price = parseFloat(searchParams.get('price') || '40500');

  const [loading, setLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [passengerData, setPassengerData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    passportNumber: '',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [addOns, setAddOns] = useState({
    insurance: false,
    extraBaggage: false,
    seatSelection: false,
  });

  const addOnPrices = {
    insurance: 2075,
    extraBaggage: 4150,
    seatSelection: 2490,
  };
  
  // Auto-enable seat selection add-on when a seat is selected
  const handleSeatSelect = (seat: string) => {
    setSelectedSeat(seat);
    if (seat && !addOns.seatSelection) {
      setAddOns({ ...addOns, seatSelection: true });
    }
  };

  const calculateTotal = () => {
    let total = price;
    if (addOns.insurance) total += addOnPrices.insurance;
    if (addOns.extraBaggage) total += addOnPrices.extraBaggage;
    if (addOns.seatSelection) total += addOnPrices.seatSelection;
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate seat selection if add-on is selected
    if (addOns.seatSelection && !selectedSeat) {
      toast.error('Please select a seat or uncheck the seat selection add-on');
      return;
    }
    
    setLoading(true);

    try {
      // In a real app, this would process payment through Stripe and create booking
      const bookingData = {
        flightId: id,
        fareClass,
        passenger: passengerData,
        addOns,
        selectedSeat: addOns.seatSelection ? selectedSeat : null,
        totalPrice: calculateTotal(),
        userId: user?.id,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken || publicAnonKey}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const data = await response.json();
      toast.success('Booking confirmed!');
      navigate(`/booking/confirmation/${data.bookingId}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-foreground mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Delhi to London • {fareClass} Class</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Passenger Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={passengerData.firstName}
                        onChange={(e) => setPassengerData({ ...passengerData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={passengerData.lastName}
                        onChange={(e) => setPassengerData({ ...passengerData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={passengerData.email}
                        onChange={(e) => setPassengerData({ ...passengerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={passengerData.phone}
                        onChange={(e) => setPassengerData({ ...passengerData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={passengerData.dateOfBirth}
                        onChange={(e) => setPassengerData({ ...passengerData, dateOfBirth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport">Passport Number</Label>
                      <Input
                        id="passport"
                        value={passengerData.passportNumber}
                        onChange={(e) => setPassengerData({ ...passengerData, passportNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seat Selection - Always visible after passenger details */}
              <SeatSelector
                selectedSeat={selectedSeat}
                onSeatSelect={handleSeatSelect}
                fareClass={fareClass}
              />

              {/* Add-ons */}
              <Card>
                <CardHeader>
                  <CardTitle>Add-ons & Extras</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="insurance"
                        checked={addOns.insurance}
                        onCheckedChange={(checked) => setAddOns({ ...addOns, insurance: !!checked })}
                      />
                      <div>
                        <Label htmlFor="insurance" className="cursor-pointer">
                          Travel Insurance
                        </Label>
                        <p className="text-muted-foreground">Protect your trip with comprehensive coverage</p>
                      </div>
                    </div>
                    <p className="text-foreground">+{formatINR(addOnPrices.insurance)}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="extraBaggage"
                        checked={addOns.extraBaggage}
                        onCheckedChange={(checked) => setAddOns({ ...addOns, extraBaggage: !!checked })}
                      />
                      <div>
                        <Label htmlFor="extraBaggage" className="cursor-pointer">
                          Extra Baggage
                        </Label>
                        <p className="text-muted-foreground">Add 1 additional checked bag (23kg)</p>
                      </div>
                    </div>
                    <p className="text-foreground">+{formatINR(addOnPrices.extraBaggage)}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="seatSelection"
                        checked={addOns.seatSelection}
                        onCheckedChange={(checked) => {
                          setAddOns({ ...addOns, seatSelection: !!checked });
                          if (!checked) setSelectedSeat(null);
                        }}
                      />
                      <div>
                        <Label htmlFor="seatSelection" className="cursor-pointer">
                          Preferred Seat Selection
                        </Label>
                        <p className="text-muted-foreground">Choose your favorite seat in advance</p>
                      </div>
                    </div>
                    <p className="text-foreground">+{formatINR(addOnPrices.seatSelection)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      value={cardData.cardName}
                      onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardData.expiryDate}
                        onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-secondary/50 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <p className="text-muted-foreground">
                      Your payment is secured with SSL encryption and PCI-DSS compliance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-muted-foreground">Flight</p>
                    <p className="text-foreground">Delhi → London</p>
                    <p className="text-muted-foreground">Dec 15, 2025</p>
                    {selectedSeat && (
                      <p className="text-sm text-primary mt-1">Seat: {selectedSeat}</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">{fareClass} Class</span>
                      <span className="text-foreground">{formatINR(price)}</span>
                    </div>
                    {addOns.insurance && (
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Travel Insurance</span>
                        <span className="text-foreground">{formatINR(addOnPrices.insurance)}</span>
                      </div>
                    )}
                    {addOns.extraBaggage && (
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Extra Baggage</span>
                        <span className="text-foreground">{formatINR(addOnPrices.extraBaggage)}</span>
                      </div>
                    )}
                    {addOns.seatSelection && (
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Seat Selection {selectedSeat ? `(${selectedSeat})` : ''}</span>
                        <span className="text-foreground">{formatINR(addOnPrices.seatSelection)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatINR(calculateTotal())}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Confirm & Pay
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By completing this booking, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}