import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { Plane, Menu, X, User, LogOut, LayoutDashboard, Bell, ActivitySquare, MessageCircle, HelpCircle, Database } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Header() {
  const context = useContext(AppContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!context) return null;
  const { user, setUser, supabase } = context;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/flights/search', label: 'Flights', icon: Plane },
    { path: '/dashboard', label: 'My Trips', icon: LayoutDashboard, authRequired: true },
    { path: '/alerts', label: 'Alerts', icon: Bell, authRequired: true },
    { path: '/status', label: 'Flight Status', icon: ActivitySquare },
    { path: '/support', label: 'Help', icon: HelpCircle },
  ];

  // Add admin link if user is admin
  const adminNavLinks = user?.role === 'admin' ? [
    { path: '/admin/settings', label: 'Database', icon: Database, authRequired: true, adminOnly: true }
  ] : [];

  const allNavLinks = [...navLinks, ...adminNavLinks];

  const isLandingPage = location.pathname === '/';

  // Don't render header on landing page
  if (isLandingPage) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground">
              SkySmart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {allNavLinks.map((link) => {
              if (link.authRequired && !user) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* AI Chat Button */}
            <Link to="/chat">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-muted-foreground">
                      {user.name || user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/database" className="cursor-pointer">
                      <Database className="w-4 h-4 mr-2" />
                      Database
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {allNavLinks.map((link) => {
                    if (link.authRequired && !user) return null;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                          isActive(link.path)
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/70 hover:bg-secondary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                  <Link
                    to="/chat"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-md text-foreground/70 hover:bg-secondary"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>AI Chat</span>
                  </Link>
                  {user ? (
                    <>
                      <hr className="border-border" />
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-md text-foreground/70 hover:bg-secondary"
                      >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-3 rounded-md text-destructive hover:bg-secondary"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <hr className="border-border" />
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3"
                      >
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="px-4"
                      >
                        <Button className="w-full bg-accent hover:bg-accent/90">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}