import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plane, User, Users } from 'lucide-react';

interface SeatSelectorProps {
  selectedSeat: string | null;
  onSeatSelect: (seat: string) => void;
  fareClass: string;
}

export default function SeatSelector({ selectedSeat, onSeatSelect, fareClass }: SeatSelectorProps) {
  // Define seat types
  const seatTypes = {
    available: 'Available',
    selected: 'Selected',
    occupied: 'Occupied',
    premium: 'Premium',
    exit: 'Exit Row',
  };

  // Realistically distributed occupied seats (mock data)
  const occupiedSeats = [
    // Business class occupied
    '1A', '1C', '2B', '2D', '3A', '4C', '5B',
    // Premium Economy occupied
    '6B', '7C', '7F', '8A', '8E', '9D', '10B', '10F', '11C',
    // Economy occupied - distributed naturally
    '12A', '12F', '13B', '13E', '14C', '14D', '15A', '15F',
    '16B', '16E', '17C', '18A', '18D', '18F', '19B', '19E',
    '20A', '20C', '20F', '21D', '21E', '22B', '22C', '23A', '23F',
    '24B', '24D', '24E', '25C', '25F', '26A', '26D', '27B', '27E',
    '28C', '28F', '29A', '29D', '30B', '30E'
  ];
  
  // Premium seats (extra legroom) - rows 1-5 in Business, row 12-13 in Economy
  const premiumSeats = ['1A', '1B', '1C', '1D', '1E', '1F', '12A', '12B', '12C', '12D', '12E', '12F'];
  
  // Exit row seats - extra legroom
  const exitRowSeats = ['12A', '12B', '12C', '12D', '12E', '12F', '13A', '13B', '13C', '13D', '13E', '13F'];

  // Generate seats based on fare class
  const generateSeats = () => {
    let rows: number[];
    
    if (fareClass === 'Business') {
      // Business class: rows 1-5, seats A-D (2-2 configuration)
      rows = Array.from({ length: 5 }, (_, i) => i + 1);
      return rows.map(row => ['A', 'B', '', 'C', 'D'].map(col => col ? `${row}${col}` : null));
    } else if (fareClass === 'Premium Economy') {
      // Premium Economy: rows 6-11, seats A-F (3-3 configuration)
      rows = Array.from({ length: 6 }, (_, i) => i + 6);
      return rows.map(row => ['A', 'B', 'C', '', 'D', 'E', 'F'].map(col => col ? `${row}${col}` : null));
    } else {
      // Economy: rows 12-30, seats A-F (3-3 configuration)
      rows = Array.from({ length: 19 }, (_, i) => i + 12);
      return rows.map(row => ['A', 'B', 'C', '', 'D', 'E', 'F'].map(col => col ? `${row}${col}` : null));
    }
  };

  const seats = generateSeats();

  const getSeatStatus = (seat: string) => {
    if (!seat) return null;
    if (seat === selectedSeat) return 'selected';
    if (occupiedSeats.includes(seat)) return 'occupied';
    if (exitRowSeats.includes(seat) && !occupiedSeats.includes(seat)) return 'exit';
    if (premiumSeats.includes(seat) && !occupiedSeats.includes(seat)) return 'premium';
    return 'available';
  };

  const getSeatColor = (status: string | null) => {
    switch (status) {
      case 'selected':
        return 'bg-primary text-primary-foreground hover:bg-primary shadow-lg';
      case 'occupied':
        return 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60';
      case 'premium':
        return 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400 hover:from-purple-200 hover:to-purple-300 cursor-pointer shadow-sm';
      case 'exit':
        return 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 hover:from-blue-200 hover:to-blue-300 cursor-pointer shadow-sm';
      default:
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:from-green-100 hover:to-green-200 cursor-pointer shadow-sm';
    }
  };

  const handleSeatClick = (seat: string) => {
    const status = getSeatStatus(seat);
    if (status !== 'occupied') {
      onSeatSelect(seat);
    }
  };

  return (
    <Card className="shadow-xl border-2">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plane className="w-6 h-6 text-primary" />
            Select Your Seat - {fareClass} Class
          </CardTitle>
          {selectedSeat && (
            <Badge variant="default" className="bg-primary text-white px-4 py-2 text-base">
              Seat: {selectedSeat}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-8 p-5 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100 rounded-md"></div>
            <span className="text-sm font-medium text-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md shadow-lg"></div>
            <span className="text-sm font-medium text-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-400 opacity-60 rounded-md"></div>
            <span className="text-sm font-medium text-foreground">Occupied</span>
          </div>
          {fareClass === 'Economy' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-400 rounded-md"></div>
                <span className="text-sm font-medium text-foreground">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded-md"></div>
                <span className="text-sm font-medium text-foreground">Exit Row</span>
              </div>
            </>
          )}
        </div>

        {/* Aircraft Visualization */}
        <div className="overflow-x-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border-2 border-border">
          <div className="inline-block min-w-full">
            {/* Cockpit */}
            <div className="flex justify-center mb-6">
              <div className="relative w-full max-w-md">
                <div className="h-16 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200 rounded-t-[100px] flex items-center justify-center border-4 border-gray-400 shadow-lg">
                  <Plane className="w-8 h-8 text-gray-700" />
                </div>
                <div className="absolute -left-8 top-4 w-8 h-8 bg-gray-300 rounded-l-full"></div>
                <div className="absolute -right-8 top-4 w-8 h-8 bg-gray-300 rounded-r-full"></div>
              </div>
            </div>

            {/* Seat Column Labels */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-12"></div>
              {fareClass === 'Business' ? (
                <div className="flex gap-1">
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">A</div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">B</div>
                  <div className="w-4"></div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">C</div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">D</div>
                </div>
              ) : (
                <div className="flex gap-1">
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">A</div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">B</div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">C</div>
                  <div className="w-6"></div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">D</div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">E</div>
                  <div className="w-10 text-center text-xs font-bold text-muted-foreground">F</div>
                </div>
              )}
              <div className="w-12"></div>
            </div>

            {/* Seat rows */}
            <div className="space-y-2">
              {seats.map((row, rowIndex) => {
                const rowNumber = fareClass === 'Business' ? rowIndex + 1 : 
                                 fareClass === 'Premium Economy' ? rowIndex + 6 : 
                                 rowIndex + 12;
                
                // Show wing indicator
                const isWingRow = fareClass === 'Economy' && rowNumber === 18;
                
                return (
                  <div key={rowIndex}>
                    {isWingRow && (
                      <div className="flex justify-center my-4">
                        <div className="relative w-full max-w-2xl h-12">
                          <div className="absolute left-0 top-0 w-32 h-12 bg-gradient-to-r from-transparent via-gray-300 to-gray-400 rounded-r-full shadow-md"></div>
                          <div className="absolute right-0 top-0 w-32 h-12 bg-gradient-to-l from-transparent via-gray-300 to-gray-400 rounded-l-full shadow-md"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                              ✈️ WING
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2">
                      {/* Row number - left */}
                      <div className="w-12 text-center text-sm font-bold text-muted-foreground bg-secondary/50 rounded px-2 py-1">
                        {rowNumber}
                      </div>

                      {/* Seats */}
                      <div className="flex gap-1">
                        {row.map((seat, seatIndex) => {
                          if (!seat) {
                            // Aisle space
                            return (
                              <div key={seatIndex} className="w-6 h-10 flex items-center justify-center">
                                <div className="w-0.5 h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
                              </div>
                            );
                          }

                          const status = getSeatStatus(seat);
                          const color = getSeatColor(status);

                          return (
                            <button
                              key={seatIndex}
                              type="button"
                              onClick={() => handleSeatClick(seat)}
                              disabled={status === 'occupied'}
                              className={`w-10 h-10 rounded-lg border-2 text-xs font-bold transition-all transform hover:scale-110 ${color} ${
                                status === 'selected' ? 'ring-4 ring-primary ring-offset-2 scale-110' : ''
                              }`}
                              title={`Seat ${seat} - ${status}`}
                            >
                              {status === 'occupied' ? (
                                <User className="w-4 h-4 mx-auto" />
                              ) : (
                                <span>{seat.slice(-1)}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Row number - right */}
                      <div className="w-12 text-center text-sm font-bold text-muted-foreground bg-secondary/50 rounded px-2 py-1">
                        {rowNumber}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tail section */}
            <div className="flex justify-center mt-6">
              <div className="w-full max-w-md h-12 bg-gradient-to-t from-gray-400 via-gray-300 to-gray-200 rounded-b-[80px] border-4 border-gray-400 shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Info message */}
        {selectedSeat ? (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800 dark:text-green-200">
                  Seat {selectedSeat} selected successfully!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  {exitRowSeats.includes(selectedSeat) && '✨ Exit Row - Extra Legroom & Quick Exit Access'}
                  {premiumSeats.includes(selectedSeat) && !exitRowSeats.includes(selectedSeat) && '⭐ Premium Seat - Enhanced Comfort'}
                  {!exitRowSeats.includes(selectedSeat) && !premiumSeats.includes(selectedSeat) && '✓ Standard seat with full amenities'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              💺 Click on any available seat to select it
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}