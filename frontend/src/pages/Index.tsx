
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { useToast } from "@/hooks/use-toast";
import { trackPageVisit, trackEvent } from "@/utils/analytics";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { toast } = useToast();
  
  // Add cursor animation state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  // Track mouse position for cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setIsPageLoaded(true);
    
    // Track page visit
    trackPageVisit();

    // Detect if dark mode is enabled via media query
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    trackEvent("page_theme_detected", { isDarkMode: prefersDark });
  }, []);

  const handleLogin = (userData: { email: string; role: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Track login event
    trackEvent("user_login", { email: userData.email, role: userData.role });
    
    toast({
      title: "Connexion réussie",
      description: `Bienvenue ${userData.email}`,
    });
  };

  const handleLogout = () => {
    // Track logout event
    if (user) {
      trackEvent("user_logout", { email: user.email });
    }
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    trackEvent("scroll_to_features");
  };

  // Cursor variants for animation
  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(124, 58, 237, 0.1)",
      border: "2px solid rgba(124, 58, 237, 0.5)",
      transition: {
        type: "spring",
        mass: 0.6
      }
    },
    link: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(124, 58, 237, 0.2)",
      border: "2px solid rgba(124, 58, 237, 0.8)",
      transition: {
        type: "spring",
        mass: 0.6
      }
    }
  };

  // Toggle cursor on hover
  const enterLink = () => setCursorVariant("link");
  const leaveLink = () => setCursorVariant("default");

  // Add event listeners to links and buttons
  useEffect(() => {
    const handleLinks = () => {
      const allLinks = document.querySelectorAll('a, button, [role="button"]');
      allLinks.forEach(link => {
        link.addEventListener('mouseenter', enterLink);
        link.addEventListener('mouseleave', leaveLink);
      });

      return () => {
        allLinks.forEach(link => {
          link.removeEventListener('mouseenter', enterLink);
          link.removeEventListener('mouseleave', leaveLink);
        });
      };
    };

    // Wait for DOM to be fully loaded
    if (isPageLoaded) {
      const timeout = setTimeout(handleLinks, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isPageLoaded]);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Dashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-gradient-to-br from-rent-blue-50 via-background to-rent-purple-50 dark:from-rent-blue-950 dark:via-background dark:to-rent-purple-950 overflow-hidden">
        {/* Custom cursor */}
        <motion.div
          variants={cursorVariants}
          animate={cursorVariant}
          className="custom-cursor fixed top-0 left-0 rounded-full pointer-events-none z-50 hidden md:block"
          style={{ 
            mixBlendMode: "difference", 
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isPageLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen flex flex-col"
        >
          {/* Decorative elements with more interactivity */}
          <motion.div 
            className="absolute top-20 left-[5%] w-64 h-64 bg-rent-blue-400 dark:bg-rent-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.2, 1], 
              x: mousePosition.x / 60,
              y: mousePosition.y / -80
            }}
            transition={{ 
              duration: 3, 
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-[10%] w-80 h-80 bg-rent-purple-400 dark:bg-rent-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{ 
              scale: [1, 1.3, 1], 
              x: mousePosition.x / -70,
              y: mousePosition.y / 60
            }}
            transition={{ 
              duration: 4,
              ease: "easeInOut"
            }}
          />
          
          {/* Background patterns */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10 z-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPageLoaded ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-rent-blue-300 dark:text-rent-blue-800"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </motion.div>
          </div>

          {/* Header with login functionality */}
          <HomeHeader 
            isPageLoaded={isPageLoaded} 
            onLogin={handleLogin} 
            trackEvent={trackEvent}
          />

          {/* Hero content - centered now */}
          <div className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 lg:px-8 z-10">
            <HeroSection 
              isPageLoaded={isPageLoaded} 
              scrollToFeatures={scrollToFeatures} 
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isPageLoaded ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
            onClick={scrollToFeatures}
            onMouseEnter={enterLink}
            onMouseLeave={leaveLink}
          >
            <motion.span 
              className="text-muted-foreground mb-2 text-sm"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Découvrez nos fonctionnalités
            </motion.span>
            <motion.div
              animate={{ 
                y: [0, 5, 0],
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                y: { duration: 1.5, repeat: Infinity },
                scale: { duration: 1, repeat: Infinity }
              }}
            >
              <ArrowDown className="h-5 w-5 text-rent-purple-500 dark:text-rent-purple-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features section with enhanced visuals */}
        <FeaturesSection />

        {/* Footer with tracking */}
        <HomeFooter trackEvent={trackEvent} />
      </div>
    </AnimatePresence>
  );
};

export default Index;
