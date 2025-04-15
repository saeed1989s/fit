import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Bell, 
  Menu, 
  MessageSquare, 
  ShoppingBag,
  Search,
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Safely use the auth context, with fallbacks if it's not available
  let user = null;
  let logoutMutation = {
    mutate: () => console.log("Logout not available"),
    isPending: false
  };
  
  try {
    const auth = useAuth();
    user = auth.user;
    logoutMutation = auth.logoutMutation;
  } catch (error) {
    console.log("Auth provider not available yet")
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Navigation Links with active state detection
  const navLinks = [
    { href: "/", label: "Home", active: location === "/" },
    { href: "/trainers", label: "Trainers", active: location.startsWith("/trainers") },
    { href: "/workout-plans", label: "Workouts", active: location.startsWith("/workout-plans") },
    { href: "/nutrition-plans", label: "Nutrition", active: location.startsWith("/nutrition-plans") },
    { href: "/shop", label: "Shop", active: location.startsWith("/shop") },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="font-heading font-bold text-2xl text-primary cursor-pointer">
                  FitConnect
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a className={`${
                    link.active 
                      ? "border-primary text-foreground" 
                      : "border-transparent text-muted-foreground hover:border-border"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}>
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items - desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {/* Notification Button */}
            {user && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary"></span>
              </Button>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage || undefined} alt={user.fullName || 'User'} />
                      <AvatarFallback>{user.fullName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="w-full cursor-pointer flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <Menu className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a 
                  className={`${
                    link.active 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground hover:bg-muted"
                  } block pl-3 pr-4 py-2 text-base font-medium`}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={user.profileImage || undefined} alt={user.fullName || 'User'} />
                      <AvatarFallback>{user.fullName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">{user.fullName}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link href="/profile">
                    <a 
                      className="block px-4 py-2 text-base font-medium text-foreground hover:bg-muted"
                      onClick={closeMenu}
                    >
                      Your Profile
                    </a>
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-base font-medium text-destructive hover:bg-muted"
                    onClick={() => {
                      logoutMutation.mutate();
                      closeMenu();
                    }}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 px-4">
                <Button asChild className="w-full">
                  <Link href="/auth" onClick={closeMenu}>Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile bottom navigation (always visible on small screens) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white shadow-lg z-50">
        <div className="flex justify-around text-xs border-t">
          <Link href="/">
            <a className={`flex flex-col items-center py-2 ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </a>
          </Link>
          <Link href="/trainers">
            <a className={`flex flex-col items-center py-2 ${location.startsWith("/trainers") ? "text-primary" : "text-muted-foreground"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Trainers</span>
            </a>
          </Link>
          <Link href="/workout-plans">
            <a className={`flex flex-col items-center py-2 ${location.startsWith("/workout-plans") ? "text-primary" : "text-muted-foreground"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Workouts</span>
            </a>
          </Link>
          <Link href="/shop">
            <a className={`flex flex-col items-center py-2 ${location.startsWith("/shop") ? "text-primary" : "text-muted-foreground"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Shop</span>
            </a>
          </Link>
          <Link href="/profile">
            <a className={`flex flex-col items-center py-2 ${location.startsWith("/profile") ? "text-primary" : "text-muted-foreground"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};
