export interface FlightData {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  aiScore: number;
  priceChange: number;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed';
  departureDetails: {
    airport: string;
    city: string;
    date: string;
    terminal: string;
    gate: string;
  };
  arrivalDetails: {
    airport: string;
    city: string;
    date: string;
    terminal: string;
    gate: string;
  };
  baggage: string;
  delay?: string | null;
}

export const FLIGHT_DATABASE: FlightData[] = [
  {
    id: '1',
    flightNumber: '6E-2045',
    airline: 'IndiGo',
    aircraft: 'Airbus A320neo',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '06:00 AM',
    arrival: '08:15 AM',
    duration: '2h 15m',
    price: 4850,
    stops: 0,
    aiScore: 95,
    priceChange: -12, // Fixed: was -320, now realistic percentage
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 15, 2025',
      terminal: 'Terminal 3',
      gate: 'D21',
    },
    arrivalDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 15, 2025',
      terminal: 'Terminal 2',
      gate: 'A15',
    },
    baggage: 'Carousel 4',
    delay: null,
  },
  {
    id: '2',
    flightNumber: 'AI-864',
    airline: 'Air India',
    aircraft: 'Boeing 787-8',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '09:30 AM',
    arrival: '11:45 AM',
    duration: '2h 15m',
    price: 5200,
    stops: 0,
    aiScore: 88,
    priceChange: 8, // Fixed: was 180
    status: 'Boarding',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 16, 2025',
      terminal: 'Terminal 3',
      gate: 'C18',
    },
    arrivalDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 16, 2025',
      terminal: 'Terminal 2',
      gate: 'B22',
    },
    baggage: 'Carousel 2',
    delay: null,
  },
  {
    id: '3',
    flightNumber: 'UK-955',
    airline: 'Vistara',
    aircraft: 'Airbus A321neo',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '01:00 PM',
    arrival: '03:20 PM',
    duration: '2h 20m',
    price: 6100,
    stops: 0,
    aiScore: 92,
    priceChange: -18, // Fixed: was -250
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 17, 2025',
      terminal: 'Terminal 3',
      gate: 'E12',
    },
    arrivalDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 17, 2025',
      terminal: 'Terminal 2',
      gate: 'C08',
    },
    baggage: 'Carousel 1',
    delay: null,
  },
  {
    id: '4',
    flightNumber: 'SG-8194',
    airline: 'SpiceJet',
    aircraft: 'Boeing 737-800',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '04:15 PM',
    arrival: '06:30 PM',
    duration: '2h 15m',
    price: 4350,
    stops: 0,
    aiScore: 85,
    priceChange: -22, // Fixed: was -420
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 18, 2025',
      terminal: 'Terminal 3',
      gate: 'D35',
    },
    arrivalDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 18, 2025',
      terminal: 'Terminal 1',
      gate: 'A20',
    },
    baggage: 'Carousel 6',
    delay: null,
  },
  {
    id: '5',
    flightNumber: 'EK-512',
    airline: 'Emirates',
    aircraft: 'Boeing 777-300ER',
    from: 'Mumbai',
    to: 'Dubai',
    departure: '03:30 AM',
    arrival: '05:45 AM',
    duration: '3h 15m',
    price: 18500,
    stops: 0,
    aiScore: 98,
    priceChange: -28, // Fixed: was -850
    status: 'On Time',
    departureDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 19, 2025',
      terminal: 'Terminal 2',
      gate: 'B08',
    },
    arrivalDetails: {
      airport: 'Dubai International (DXB)',
      city: 'Dubai',
      date: 'Dec 19, 2025',
      terminal: 'Terminal 3',
      gate: 'B16',
    },
    baggage: 'Carousel 12',
    delay: null,
  },
  {
    id: '6',
    flightNumber: 'SQ-406',
    airline: 'Singapore Airlines',
    aircraft: 'Airbus A350-900',
    from: 'Bangalore',
    to: 'Singapore',
    departure: '11:00 PM',
    arrival: '07:30 AM',
    duration: '5h 30m',
    price: 24500,
    stops: 0,
    aiScore: 96,
    priceChange: 5, // Fixed: was 500
    status: 'On Time',
    departureDetails: {
      airport: 'Kempegowda International (BLR)',
      city: 'Bangalore',
      date: 'Dec 20, 2025',
      terminal: 'Terminal 1',
      gate: 'D22',
    },
    arrivalDetails: {
      airport: 'Singapore Changi (SIN)',
      city: 'Singapore',
      date: 'Dec 21, 2025',
      terminal: 'Terminal 3',
      gate: 'A18',
    },
    baggage: 'Carousel 8',
    delay: null,
  },
  {
    id: '7',
    flightNumber: 'QP-1303',
    airline: 'Akasa Air',
    aircraft: 'Boeing 737 MAX 8',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '07:45 AM',
    arrival: '10:00 AM',
    duration: '2h 15m',
    price: 4650,
    stops: 0,
    aiScore: 90,
    priceChange: -15, // Fixed: was -280
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 22, 2025',
      terminal: 'Terminal 3',
      gate: 'D18',
    },
    arrivalDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 22, 2025',
      terminal: 'Terminal 1',
      gate: 'A12',
    },
    baggage: 'Carousel 5',
    delay: null,
  },
  {
    id: '8',
    flightNumber: 'QR-572',
    airline: 'Qatar Airways',
    aircraft: 'Airbus A350-1000',
    from: 'Delhi',
    to: 'Doha',
    departure: '02:15 AM',
    arrival: '04:30 AM',
    duration: '4h 15m',
    price: 22000,
    stops: 0,
    aiScore: 97,
    priceChange: -25, // Fixed: was -650
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 23, 2025',
      terminal: 'Terminal 3',
      gate: 'F15',
    },
    arrivalDetails: {
      airport: 'Hamad International (DOH)',
      city: 'Doha',
      date: 'Dec 23, 2025',
      terminal: 'Terminal 1',
      gate: 'D05',
    },
    baggage: 'Carousel 15',
    delay: null,
  },
  {
    id: '9',
    flightNumber: 'LH-761',
    airline: 'Lufthansa',
    aircraft: 'Airbus A380-800',
    from: 'Delhi',
    to: 'Frankfurt',
    departure: '01:20 AM',
    arrival: '07:45 AM',
    duration: '8h 25m',
    price: 35000,
    stops: 0,
    aiScore: 94,
    priceChange: 10, // Fixed: was 320
    status: 'Delayed',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 24, 2025',
      terminal: 'Terminal 3',
      gate: 'G05',
    },
    arrivalDetails: {
      airport: 'Frankfurt Airport (FRA)',
      city: 'Frankfurt',
      date: 'Dec 24, 2025',
      terminal: 'Terminal 1',
      gate: 'Z69',
    },
    baggage: 'Carousel 20',
    delay: '45 min',
  },
  {
    id: '10',
    flightNumber: 'BA-142',
    airline: 'British Airways',
    aircraft: 'Boeing 787-9 Dreamliner',
    from: 'Delhi',
    to: 'London',
    departure: '02:30 AM',
    arrival: '08:15 AM',
    duration: '9h 45m',
    price: 38500,
    stops: 0,
    aiScore: 93,
    priceChange: 12, // Fixed: was 450
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 25, 2025',
      terminal: 'Terminal 3',
      gate: 'G18',
    },
    arrivalDetails: {
      airport: 'London Heathrow (LHR)',
      city: 'London',
      date: 'Dec 25, 2025',
      terminal: 'Terminal 5',
      gate: 'B12',
    },
    baggage: 'Carousel 7',
    delay: null,
  },
  {
    id: '11',
    flightNumber: 'SG-8945',
    airline: 'SpiceJet',
    aircraft: 'Boeing 737-800',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '06:45 PM',
    arrival: '09:00 PM',
    duration: '2h 15m',
    price: 4200,
    stops: 0,
    aiScore: 84,
    priceChange: -20, // Fixed: was -380
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 26, 2025',
      terminal: 'Terminal 3',
      gate: 'D42',
    },
    arrivalDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 26, 2025',
      terminal: 'Terminal 1',
      gate: 'A28',
    },
    baggage: 'Carousel 3',
    delay: null,
  },
  {
    id: '12',
    flightNumber: 'AI-658',
    airline: 'Air India',
    aircraft: 'Airbus A320',
    from: 'Delhi',
    to: 'Mumbai',
    departure: '05:30 PM',
    arrival: '07:50 PM',
    duration: '2h 20m',
    price: 5500,
    stops: 1,
    aiScore: 82,
    priceChange: 6, // Fixed: was 150
    status: 'On Time',
    departureDetails: {
      airport: 'Indira Gandhi International (DEL)',
      city: 'Delhi',
      date: 'Dec 27, 2025',
      terminal: 'Terminal 3',
      gate: 'C25',
    },
    arrivalDetails: {
      airport: 'Chhatrapati Shivaji Maharaj International (BOM)',
      city: 'Mumbai',
      date: 'Dec 27, 2025',
      terminal: 'Terminal 2',
      gate: 'B18',
    },
    baggage: 'Carousel 9',
    delay: null,
  },
];