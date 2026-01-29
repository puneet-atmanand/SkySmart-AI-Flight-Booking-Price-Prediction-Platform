// Indian Locale Utilities for SkySmart

// Format price in Indian Rupees
export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Convert USD to INR (approximate rate: 1 USD = 83 INR)
export const usdToINR = (usd: number): number => {
  return Math.round(usd * 83);
};

// Indian and International Airlines
export const INDIAN_AIRLINES = [
  'IndiGo',
  'Air India',
  'Vistara',
  'SpiceJet',
  'Akasa Air',
  'Air India Express',
  'GoFirst'
];

export const INTERNATIONAL_AIRLINES = [
  'Emirates',
  'Qatar Airways',
  'Lufthansa',
  'Singapore Airlines',
  'British Airways',
  'Etihad Airways',
  'Thai Airways',
  'Malaysia Airlines'
];

export const ALL_AIRLINES = [...INDIAN_AIRLINES, ...INTERNATIONAL_AIRLINES];

// Flight data with Indian carriers
export const AIRLINE_INFO: Record<string, { code: string; country: string }> = {
  'IndiGo': { code: '6E', country: 'India' },
  'Air India': { code: 'AI', country: 'India' },
  'Vistara': { code: 'UK', country: 'India' },
  'SpiceJet': { code: 'SG', country: 'India' },
  'Akasa Air': { code: 'QP', country: 'India' },
  'Emirates': { code: 'EK', country: 'UAE' },
  'Qatar Airways': { code: 'QR', country: 'Qatar' },
  'Lufthansa': { code: 'LH', country: 'Germany' },
  'Singapore Airlines': { code: 'SQ', country: 'Singapore' },
  'British Airways': { code: 'BA', country: 'UK' },
};

// Popular Indian airports
export const INDIAN_AIRPORTS = [
  { code: 'DEL', name: 'Delhi', city: 'New Delhi' },
  { code: 'BOM', name: 'Mumbai', city: 'Mumbai' },
  { code: 'BLR', name: 'Bangalore', city: 'Bengaluru' },
  { code: 'MAA', name: 'Chennai', city: 'Chennai' },
  { code: 'HYD', name: 'Hyderabad', city: 'Hyderabad' },
  { code: 'CCU', name: 'Kolkata', city: 'Kolkata' },
  { code: 'GOI', name: 'Goa', city: 'Goa' },
  { code: 'COK', name: 'Kochi', city: 'Kochi' },
  { code: 'AMD', name: 'Ahmedabad', city: 'Ahmedabad' },
  { code: 'PNQ', name: 'Pune', city: 'Pune' },
];
