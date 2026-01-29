import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
);

// Health check endpoint
app.get("/make-server-e56e4e4c/health", (c) => {
  console.log('Health check requested');
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    server: "SkySmart Supabase Edge Function",
    version: "1.0.0"
  });
});

// Database connection test endpoint
app.get("/make-server-e56e4e4c/db-test", async (c) => {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    console.log('SUPABASE_URL:', Deno.env.get('SUPABASE_URL'));
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
    
    // Test 1: KV Store Test
    const testKey = `test:${Date.now()}`;
    const testValue = { message: 'Database connection test', timestamp: new Date().toISOString() };
    
    console.log('Test 1: Writing to KV store...');
    await kv.set(testKey, testValue);
    console.log('✓ Write successful');
    
    console.log('Test 2: Reading from KV store...');
    const retrieved = await kv.get(testKey);
    console.log('✓ Read successful:', retrieved);
    
    console.log('Test 3: Deleting from KV store...');
    await kv.del(testKey);
    console.log('✓ Delete successful');
    
    // Test 4: Auth connection test
    console.log('Test 4: Testing auth connection...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Auth list users error:', listError);
      return c.json({ 
        error: 'Auth connection failed', 
        details: listError.message,
        kvStoreWorking: true 
      }, 500);
    }
    console.log('✓ Auth connection successful. Users in database:', users?.length || 0);
    
    return c.json({ 
      status: 'success',
      message: 'Database fully connected and operational!',
      tests: {
        kvStore: 'passed',
        auth: 'passed'
      },
      userCount: users?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return c.json({ 
      error: 'Database test failed', 
      message: error.message,
      stack: error.stack 
    }, 500);
  }
});

// Signup endpoint
app.post("/make-server-e56e4e4c/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role } = body;

    console.log('Signup request received for email:', email);

    if (!email || !password) {
      console.error('Missing required fields:', { hasEmail: !!email, hasPassword: !!password });
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Create user with Supabase Auth
    console.log('Creating user with Supabase auth...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: role || 'user' // Default to 'user' if not specified
      },
      email_confirm: true, // Auto-confirm since email server isn't configured
    });

    if (error) {
      console.error('Supabase auth.admin.createUser error:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('User created successfully:', data.user.id);

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role: role || 'user',
      createdAt: new Date().toISOString(),
    });

    console.log('User profile stored in KV store');

    return c.json({ 
      success: true, 
      userId: data.user.id,
      message: "Account created successfully" 
    });
  } catch (error: any) {
    console.error('Signup endpoint error:', error);
    return c.json({ error: error.message || "Internal server error" }, 500);
  }
});

// Get user profile
app.get("/make-server-e56e4e4c/user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ user: profile || user });
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create booking
app.post("/make-server-e56e4e4c/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const body = await c.req.json();

    let userId = body.userId;
    
    // Verify user if access token provided
    if (accessToken && accessToken !== Deno.env.get('SUPABASE_ANON_KEY')) {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (error || !user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      userId = user.id;
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const confirmationCode = `SKY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Use selected seat if provided, otherwise generate random seat
    const seat = body.selectedSeat || `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
    
    const booking = {
      id: bookingId,
      userId,
      flightId: body.flightId,
      fareClass: body.fareClass,
      passenger: body.passenger,
      addOns: body.addOns,
      totalPrice: body.totalPrice,
      status: 'confirmed',
      confirmationCode,
      seat: seat,
      baggage: '1 x 23kg checked bag',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, booking);
    
    // Also store booking reference under user
    if (userId) {
      const userBookingsKey = `user_bookings:${userId}`;
      const existingBookings = await kv.get(userBookingsKey) || [];
      await kv.set(userBookingsKey, [...existingBookings, bookingId]);
    }

    return c.json({ bookingId, confirmationCode: booking.confirmationCode });
  } catch (error: any) {
    console.error('Booking error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get booking by ID
app.get("/make-server-e56e4e4c/bookings/:id", async (c) => {
  try {
    const bookingId = c.req.param('id');
    const booking = await kv.get(`booking:${bookingId}`);
    
    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    return c.json({ booking });
  } catch (error: any) {
    console.error('Get booking error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get user bookings
app.get("/make-server-e56e4e4c/user/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bookingIds = await kv.get(`user_bookings:${user.id}`) || [];
    const bookings = await Promise.all(
      bookingIds.map((id: string) => kv.get(`booking:${id}`))
    );

    return c.json({ bookings: bookings.filter(Boolean) });
  } catch (error: any) {
    console.error('Get user bookings error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create price alert
app.post("/make-server-e56e4e4c/alerts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const alert = {
      id: alertId,
      userId: user.id,
      ...body,
      active: true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`alert:${alertId}`, alert);

    // Store alert reference under user
    const userAlertsKey = `user_alerts:${user.id}`;
    const existingAlerts = await kv.get(userAlertsKey) || [];
    await kv.set(userAlertsKey, [...existingAlerts, alertId]);

    return c.json({ alertId, alert });
  } catch (error: any) {
    console.error('Create alert error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get user alerts
app.get("/make-server-e56e4e4c/user/alerts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const alertIds = await kv.get(`user_alerts:${user.id}`) || [];
    const alerts = await Promise.all(
      alertIds.map((id: string) => kv.get(`alert:${id}`))
    );

    return c.json({ alerts: alerts.filter(Boolean) });
  } catch (error: any) {
    console.error('Get user alerts error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete alert
app.delete("/make-server-e56e4e4c/alerts/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const alertId = c.req.param('id');
    await kv.del(`alert:${alertId}`);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Delete alert error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// AI Chat endpoint
app.post("/make-server-e56e4e4c/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { message, conversationHistory } = body;

    // Mock AI response for now - in production, this would call OpenAI API
    const responses = [
      "I can help you find the best flights! What's your destination and travel dates?",
      "Great choice! I found several options. Would you like me to show you the cheapest or the fastest flights?",
      "Based on historical data, prices for this route are currently 15% below average. I'd recommend booking soon!",
      "I can set up a price alert for you. What's your target price?",
      "The best time to book flights to that destination is typically 6-8 weeks in advance.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return c.json({ 
      response: randomResponse,
      suggestions: ["Search flights", "Set price alert", "View trending routes"]
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Flight search endpoint (mock data)
app.get("/make-server-e56e4e4c/flights/search", async (c) => {
  try {
    const from = c.req.query('from') || 'New York';
    const to = c.req.query('to') || 'London';
    const date = c.req.query('date');

    // Mock flight data
    const flights = [
      {
        id: '1',
        airline: 'Delta Airlines',
        flightNumber: 'DL 123',
        from,
        to,
        departure: '08:30 AM',
        arrival: '08:45 PM',
        duration: '7h 15m',
        price: 489,
        stops: 0,
        aiScore: 95,
        priceChange: -12,
      },
      {
        id: '2',
        airline: 'United Airlines',
        flightNumber: 'UA 456',
        from,
        to,
        departure: '11:00 AM',
        arrival: '11:30 PM',
        duration: '7h 30m',
        price: 525,
        stops: 0,
        aiScore: 88,
        priceChange: 5,
      },
    ];

    return c.json({ flights });
  } catch (error: any) {
    console.error('Flight search error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Admin Stats endpoint
app.get("/make-server-e56e4e4c/admin/stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify admin user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Admin auth error:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (user.user_metadata?.role !== 'admin') {
      console.log('Non-admin user attempted to access admin stats:', user.email);
      return c.json({ error: 'Access denied. Admin role required.' }, 403);
    }

    console.log('Admin stats request from:', user.email);

    // Get all users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    // Get all bookings
    const bookings = await kv.getByPrefix('booking:');
    
    // Get all alerts
    const alerts = await kv.getByPrefix('alert:');

    // Prepare user data (remove sensitive info)
    const usersData = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email?.split('@')[0],
      role: u.user_metadata?.role || 'user',
      created_at: u.created_at,
    }));

    return c.json({
      stats: {
        totalUsers: users.length,
        totalBookings: bookings.length,
        totalAlerts: alerts.length,
        totalFlights: 12,
      },
      users: usersData,
      bookings: bookings,
      alerts: alerts,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Admin Clear Bookings endpoint
app.delete("/make-server-e56e4e4c/admin/clear-bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify admin user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user || user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Access denied. Admin role required.' }, 403);
    }

    console.log('Admin clearing all bookings, requested by:', user.email);

    // Get all booking keys
    const bookings = await kv.getByPrefix('booking:');
    const bookingKeys = bookings.map(b => b.key);

    // Delete all bookings
    if (bookingKeys.length > 0) {
      await kv.mdel(bookingKeys);
    }

    console.log(`Cleared ${bookingKeys.length} bookings`);

    return c.json({ 
      success: true, 
      message: `Cleared ${bookingKeys.length} bookings`,
      count: bookingKeys.length 
    });
  } catch (error: any) {
    console.error('Admin clear bookings error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Admin Clear Alerts endpoint
app.delete("/make-server-e56e4e4c/admin/clear-alerts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify admin user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user || user.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Access denied. Admin role required.' }, 403);
    }

    console.log('Admin clearing all alerts, requested by:', user.email);

    // Get all alert keys
    const alerts = await kv.getByPrefix('alert:');
    const alertKeys = alerts.map(a => a.key);

    // Delete all alerts
    if (alertKeys.length > 0) {
      await kv.mdel(alertKeys);
    }

    console.log(`Cleared ${alertKeys.length} alerts`);

    return c.json({ 
      success: true, 
      message: `Cleared ${alertKeys.length} alerts`,
      count: alertKeys.length 
    });
  } catch (error: any) {
    console.error('Admin clear alerts error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Global error handler
app.onError((err, c) => {
  console.error('Global error handler:', err);
  return c.json({ 
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

// 404 handler for unmatched routes
app.notFound((c) => {
  console.log('404 - Route not found:', c.req.url);
  return c.json({ 
    error: 'Route not found',
    path: c.req.url,
    availableEndpoints: [
      '/make-server-e56e4e4c/health',
      '/make-server-e56e4e4c/db-test',
      '/make-server-e56e4e4c/signup',
      '/make-server-e56e4e4c/user',
      '/make-server-e56e4e4c/bookings',
      '/make-server-e56e4e4c/alerts',
      '/make-server-e56e4e4c/chat',
      '/make-server-e56e4e4c/flights/search',
      '/make-server-e56e4e4c/admin/stats'
    ]
  }, 404);
});

Deno.serve(app.fetch);