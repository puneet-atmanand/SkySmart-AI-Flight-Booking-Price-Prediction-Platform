import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Calendar, Plane, MapPin, Mail, Share2 } from 'lucide-react';
import { formatINR } from '../../utils/indian-locale';
import { FLIGHT_DATABASE } from '../../utils/flight-data';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import QRCode from 'qrcode';
import { sendBookingConfirmationEmail, previewBookingEmail, BookingEmailData } from '../../utils/email-service';
import { toast } from 'sonner';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-e56e4e4c/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const { booking: bookingData } = await response.json();
          
          // Get flight details from FLIGHT_DATABASE
          const flightDetails = FLIGHT_DATABASE.find(f => f.id === bookingData.flightId);
          
          if (flightDetails) {
            const fullBooking = {
              ...bookingData,
              flight: flightDetails,
            };
            setBooking(fullBooking);

            // Generate QR code with booking information
            const qrData = JSON.stringify({
              confirmationCode: bookingData.confirmationCode,
              passenger: bookingData.passenger.firstName + ' ' + bookingData.passenger.lastName,
              flight: flightDetails.flightNumber,
              from: flightDetails.from,
              to: flightDetails.to,
              date: flightDetails.departureDetails.date,
            });

            const qrUrl = await QRCode.toDataURL(qrData, {
              width: 200,
              margin: 2,
              color: {
                dark: '#007ACC',
                light: '#FFFFFF'
              }
            });
            setQrCodeUrl(qrUrl);
            
            // Send confirmation email automatically
            if (!emailSent) {
              const emailData: BookingEmailData = {
                customerName: `${bookingData.passenger.firstName} ${bookingData.passenger.lastName}`,
                customerEmail: bookingData.passenger.email,
                bookingId: bookingData.id,
                pnrCode: bookingData.confirmationCode,
                bookingDateTime: new Date(bookingData.createdAt || Date.now()).toLocaleString('en-IN', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                }),
                passengerNames: [`${bookingData.passenger.firstName} ${bookingData.passenger.lastName}`],
                airline: flightDetails.airline,
                flightNumber: flightDetails.flightNumber,
                departureCity: flightDetails.from,
                departureAirport: flightDetails.departureDetails.airport,
                departureDate: flightDetails.departureDetails.date,
                departureTime: flightDetails.departure,
                arrivalCity: flightDetails.to,
                arrivalAirport: flightDetails.arrivalDetails.airport,
                arrivalDate: flightDetails.arrivalDetails.date,
                arrivalTime: flightDetails.arrival,
                terminal: flightDetails.departureDetails.terminal,
                baggageAllowance: bookingData.baggage || '15kg Cabin + 30kg Check-in',
                totalAmount: formatINR(bookingData.totalPrice || 0),
                paymentMethod: bookingData.paymentMethod || 'Credit Card',
                transactionId: bookingData.transactionId || `TXN${Date.now()}`,
              };

              try {
                await sendBookingConfirmationEmail(emailData);
                setEmailSent(true);
                toast.success('Booking confirmation email sent to ' + bookingData.passenger.email);
              } catch (error) {
                console.error('Error sending email:', error);
                toast.error('Failed to send confirmation email');
              }
            }
          }
        } else {
          console.error('Failed to fetch booking');
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-secondary/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-secondary/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">\
            <h3 className="text-foreground mb-2">Booking Not Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find this booking. Please check your confirmation code.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    // In a real app, this would generate and download PDF
    alert('Downloading e-ticket PDF...');
  };

  const handleShare = () => {
    // In a real app, this would open share dialog
    alert('Share booking details...');
  };

  const handlePreviewEmail = () => {
    if (booking) {
      const emailData: BookingEmailData = {
        customerName: `${booking.passenger.firstName} ${booking.passenger.lastName}`,
        customerEmail: booking.passenger.email,
        bookingId: booking.id,
        pnrCode: booking.confirmationCode,
        bookingDateTime: new Date(booking.createdAt || Date.now()).toLocaleString('en-IN', {
          dateStyle: 'long',
          timeStyle: 'short',
        }),
        passengerNames: [`${booking.passenger.firstName} ${booking.passenger.lastName}`],
        airline: booking.flight.airline,
        flightNumber: booking.flight.flightNumber,
        departureCity: booking.flight.from,
        departureAirport: booking.flight.departureDetails.airport,
        departureDate: booking.flight.departureDetails.date,
        departureTime: booking.flight.departure,
        arrivalCity: booking.flight.to,
        arrivalAirport: booking.flight.arrivalDetails.airport,
        arrivalDate: booking.flight.arrivalDetails.date,
        arrivalTime: booking.flight.arrival,
        terminal: booking.flight.departureDetails.terminal,
        baggageAllowance: booking.baggage || '15kg Cabin + 30kg Check-in',
        totalAmount: formatINR(booking.totalPrice || 0),
        paymentMethod: booking.paymentMethod || 'Credit Card',
        transactionId: booking.transactionId || `TXN${Date.now()}`,
      };
      
      previewBookingEmail(emailData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-secondary/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your flight to {booking?.flight?.to} has been successfully booked
          </p>
          <Badge className="mt-4 bg-green-600">
            Confirmation Code: {booking?.confirmationCode}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download E-Ticket
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <Calendar className="w-4 h-4 mr-2" />
            View in Dashboard
          </Button>
        </div>

        {/* QR Code & Booking Details */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* QR Code */}
              <div className="text-center">
                <div className="w-48 h-48 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                </div>
                <p className="text-muted-foreground">
                  Scan this QR code at the airport for check-in
                </p>
              </div>

              {/* Flight Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1">Flight</p>
                  <p className="text-foreground">
                    {booking?.flight.airline} • {booking?.flight.flightNumber}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">Passenger</p>
                  <p className="text-foreground">{booking?.passenger.firstName} {booking?.passenger.lastName}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground mb-1">Class</p>
                    <p className="text-foreground">{booking?.fareClass}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Seat</p>
                    <p className="text-foreground">{booking?.seat}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">Baggage</p>
                  <p className="text-foreground">{booking?.baggage}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Itinerary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Flight Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Departure */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Plane className="w-6 h-6 text-primary rotate-45" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground">Departure</p>
                  <p className="text-foreground">{booking?.flight.departure}</p>
                  <p className="text-muted-foreground">{booking?.flight.from}</p>
                  <p className="text-muted-foreground">{booking?.flight.date}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <Badge variant="secondary">
                      {booking?.flight.terminal}
                    </Badge>
                    <Badge variant="secondary">
                      Gate {booking?.flight.gate}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center pl-6">
                <div className="w-px h-12 bg-border"></div>
                <p className="text-muted-foreground ml-4">{booking?.flight.duration}</p>
              </div>

              {/* Arrival */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground">Arrival</p>
                  <p className="text-foreground">{booking?.flight.arrival}</p>
                  <p className="text-muted-foreground">{booking?.flight.to}</p>
                  <p className="text-muted-foreground">{booking?.flight.date}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Confirmation Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Mail className="w-5 h-5" />
              <p>
                We've sent your e-ticket and booking details to{' '}
                <span className="text-foreground">{booking?.passenger.email}</span>
              </p>
            </div>
            <Button 
              variant="link" 
              onClick={handlePreviewEmail}
              className="mt-2 p-0 h-auto text-primary"
            >
              Preview Email
            </Button>
            <p className="text-muted-foreground mt-4">
              Need help? Contact our support team at{' '}
              <a href="/support" className="text-primary hover:underline">
                support@skysmart.com
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <h3 className="text-foreground mb-3">Important Reminders</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Check-in opens 24 hours before departure</li>
              <li>• Arrive at the airport at least 2 hours before international flights</li>
              <li>• Bring a valid passport and any required visas</li>
              <li>• Review baggage allowances and restrictions</li>
              <li>• Download your airline's mobile app for real-time updates</li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">What would you like to do next?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/flights/search')}>
              Book Another Flight
            </Button>
            <Button variant="outline" onClick={() => navigate('/status')}>
              Track Flight Status
            </Button>
            <Button variant="outline" onClick={() => navigate('/alerts')}>
              Set Price Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}