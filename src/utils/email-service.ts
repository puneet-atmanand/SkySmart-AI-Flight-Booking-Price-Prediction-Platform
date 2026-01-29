// Email Service for SkySmart
// This service handles sending booking confirmation emails

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  pnrCode: string;
  bookingDateTime: string;
  passengerNames: string[];
  airline: string;
  flightNumber: string;
  departureCity: string;
  departureAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalCity: string;
  arrivalAirport: string;
  arrivalDate: string;
  arrivalTime: string;
  terminal: string;
  baggageAllowance: string;
  totalAmount: string;
  paymentMethod: string;
  transactionId: string;
}

/**
 * Generates the HTML email template for booking confirmation
 */
export function generateBookingConfirmationEmail(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flight Booking Confirmation</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #2C3E50;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #007ACC 0%, #0056a3 100%);
      color: #ffffff;
      padding: 25px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 30px -30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .section {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .section:last-child {
      border-bottom: none;
    }
    .section-title {
      color: #007ACC;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .info-label {
      font-weight: 600;
      color: #2C3E50;
    }
    .info-value {
      color: #555;
      text-align: right;
    }
    .passenger-list {
      list-style: none;
      padding: 0;
      margin: 10px 0;
    }
    .passenger-list li {
      padding: 5px 0;
      padding-left: 20px;
      position: relative;
    }
    .passenger-list li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #007ACC;
      font-weight: bold;
    }
    .flight-details {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin: 10px 0;
    }
    .important-info {
      background: #fff3cd;
      border-left: 4px solid #FF6B35;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .important-info ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .support-info {
      background: #e7f3ff;
      padding: 20px;
      border-radius: 6px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      color: #777;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background: #FF6B35;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 15px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ Flight Booking Confirmed</h1>
      <p style="margin: 10px 0 0 0;">Your journey with SkySmart begins here!</p>
    </div>

    <p>Dear <strong>${data.customerName}</strong>,</p>
    
    <p>Thank you for choosing <strong>SkySmart</strong>. We are pleased to inform you that your flight ticket has been successfully booked. Please find your confirmed itinerary and booking details below.</p>

    <!-- Booking Confirmation Section -->
    <div class="section">
      <div class="section-title">📋 Booking Confirmation</div>
      <div class="info-row">
        <span class="info-label">Booking ID:</span>
        <span class="info-value"><strong>${data.bookingId}</strong></span>
      </div>
      <div class="info-row">
        <span class="info-label">PNR / Reservation Code:</span>
        <span class="info-value"><strong>${data.pnrCode}</strong></span>
      </div>
      <div class="info-row">
        <span class="info-label">Booking Date & Time:</span>
        <span class="info-value">${data.bookingDateTime}</span>
      </div>
    </div>

    <!-- Passenger Details Section -->
    <div class="section">
      <div class="section-title">👤 Passenger Details</div>
      <p style="margin: 5px 0;">Passenger Name(s):</p>
      <ul class="passenger-list">
        ${data.passengerNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
    </div>

    <!-- Flight Details Section -->
    <div class="section">
      <div class="section-title">✈️ Flight Details</div>
      <div class="flight-details">
        <div class="info-row">
          <span class="info-label">Airline:</span>
          <span class="info-value">${data.airline}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Flight Number:</span>
          <span class="info-value"><strong>${data.flightNumber}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Departure:</span>
          <span class="info-value">${data.departureCity} (${data.departureAirport})</span>
        </div>
        <div class="info-row">
          <span class="info-label">Departure Date & Time:</span>
          <span class="info-value">${data.departureDate} at ${data.departureTime}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Arrival:</span>
          <span class="info-value">${data.arrivalCity} (${data.arrivalAirport})</span>
        </div>
        <div class="info-row">
          <span class="info-label">Arrival Date & Time:</span>
          <span class="info-value">${data.arrivalDate} at ${data.arrivalTime}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Terminal:</span>
          <span class="info-value">${data.terminal}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Baggage Allowance:</span>
          <span class="info-value">${data.baggageAllowance}</span>
        </div>
      </div>
    </div>

    <!-- Payment Summary Section -->
    <div class="section">
      <div class="section-title">💳 Payment Summary</div>
      <div class="info-row">
        <span class="info-label">Total Amount Paid:</span>
        <span class="info-value"><strong style="color: #007ACC; font-size: 18px;">${data.totalAmount}</strong></span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment Method:</span>
        <span class="info-value">${data.paymentMethod}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Transaction ID:</span>
        <span class="info-value">${data.transactionId}</span>
      </div>
    </div>

    <!-- Important Information -->
    <div class="important-info">
      <div class="section-title">⚠️ Important Information</div>
      <ul>
        <li>Please carry a valid government-issued ID during check-in.</li>
        <li>Arrive at the airport at least 2–3 hours before departure.</li>
        <li>For any changes, cancellations, or special service requests, please visit our portal or contact our support team.</li>
        <li>Web check-in is available 24 hours before departure.</li>
      </ul>
    </div>

    <!-- Customer Support -->
    <div class="support-info">
      <div class="section-title">📞 Customer Support</div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">support@skysmart.com</span>
      </div>
      <div class="info-row">
        <span class="info-label">Phone:</span>
        <span class="info-value">1800-3468-3409</span>
      </div>
      <p style="margin: 10px 0 0 0; font-size: 14px;">Available 24/7 for your assistance</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://skysmart.com/dashboard" class="button">View My Booking</a>
    </div>

    <p style="margin-top: 30px;">Thank you once again for booking with <strong>SkySmart</strong>.</p>
    <p>We wish you a smooth and pleasant journey! ✈️</p>

    <div class="footer">
      <p><strong>SkySmart – Travel Support Team</strong></p>
      <p style="font-size: 12px; color: #999; margin-top: 10px;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generates the plain text version of the email
 */
export function generatePlainTextEmail(data: BookingEmailData): string {
  return `
Your Flight Ticket Booking is Confirmed – Booking Details Inside

Dear ${data.customerName},

Thank you for choosing SkySmart. We are pleased to inform you that your flight ticket has been successfully booked. Please find your confirmed itinerary and booking details below.

═══════════════════════════════════════════════════
BOOKING CONFIRMATION
═══════════════════════════════════════════════════
Booking ID: ${data.bookingId}
PNR / Reservation Code: ${data.pnrCode}
Booking Date & Time: ${data.bookingDateTime}

═══════════════════════════════════════════════════
PASSENGER DETAILS
═══════════════════════════════════════════════════
Passenger Name(s):
${data.passengerNames.map(name => `• ${name}`).join('\n')}

═══════════════════════════════════════════════════
FLIGHT DETAILS
═══════════════════════════════════════════════════
Airline: ${data.airline}
Flight Number: ${data.flightNumber}
Departure: ${data.departureCity} (${data.departureAirport}) – ${data.departureDate} at ${data.departureTime}
Arrival: ${data.arrivalCity} (${data.arrivalAirport}) – ${data.arrivalDate} at ${data.arrivalTime}
Terminal: ${data.terminal}
Baggage Allowance: ${data.baggageAllowance}

═══════════════════════════════════════════════════
PAYMENT SUMMARY
═══════════════════════════════════════════════════
Total Amount Paid: ${data.totalAmount}
Payment Method: ${data.paymentMethod}
Transaction ID: ${data.transactionId}

═══════════════════════════════════════════════════
IMPORTANT INFORMATION
═══════════════════════════════════════════════════
• Please carry a valid government-issued ID during check-in.
• Arrive at the airport at least 2–3 hours before departure.
• For any changes, cancellations, or special service requests, please visit our portal or contact our support team.
• Web check-in is available 24 hours before departure.

═══════════════════════════════════════════════════
CUSTOMER SUPPORT
═══════════════════════════════════════════════════
Email: support@skysmart.com
Phone: 1800-3468-3409
Available 24/7

Thank you once again for booking with SkySmart.
We wish you a smooth and pleasant journey!

Warm regards,
SkySmart – Travel Support Team
  `.trim();
}

/**
 * Sends a booking confirmation email
 * In production, this would integrate with an email service like SendGrid, Resend, or AWS SES
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  try {
    const htmlContent = generateBookingConfirmationEmail(data);
    const textContent = generatePlainTextEmail(data);

    // In production, integrate with an email service
    // Example with Resend API:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'SkySmart <noreply@skysmart.com>',
        to: data.customerEmail,
        subject: 'Your Flight Ticket Booking is Confirmed – Booking Details Inside',
        html: htmlContent,
        text: textContent
      })
    });
    
    return response.ok;
    */

    // For development/demo, log the email and show success
    console.log('📧 Email would be sent to:', data.customerEmail);
    console.log('Subject: Your Flight Ticket Booking is Confirmed – Booking Details Inside');
    console.log('\n--- HTML EMAIL PREVIEW ---');
    console.log(htmlContent);
    console.log('\n--- PLAIN TEXT EMAIL ---');
    console.log(textContent);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store email in localStorage for demo purposes
    const emailLog = {
      to: data.customerEmail,
      subject: 'Your Flight Ticket Booking is Confirmed – Booking Details Inside',
      timestamp: new Date().toISOString(),
      bookingId: data.bookingId,
      html: htmlContent,
      text: textContent
    };

    const existingEmails = JSON.parse(localStorage.getItem('skysmart_sent_emails') || '[]');
    existingEmails.push(emailLog);
    localStorage.setItem('skysmart_sent_emails', JSON.stringify(existingEmails));

    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
}

/**
 * Preview email in a new window (for testing)
 */
export function previewBookingEmail(data: BookingEmailData): void {
  const htmlContent = generateBookingConfirmationEmail(data);
  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  }
}
