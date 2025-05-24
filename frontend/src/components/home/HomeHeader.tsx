
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackEvent } from "@/utils/analytics";

interface HomeHeaderProps {
  isPageLoaded: boolean;
  onLogin?: (userData: { email: string; role: string }) => void;
  trackEvent?: (eventName: string, eventData?: Record<string, any>) => void;
}

export const HomeHeader = ({ isPageLoaded, onLogin, trackEvent: propTrackEvent }: HomeHeaderProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    // Track form submission event
    (propTrackEvent || trackEvent)?.("login_attempt", { email });

    // Simulation d'authentification
    setTimeout(() => {
      if (email && password) {
        if (!isLogin && password !== confirmPassword) {
          (propTrackEvent || trackEvent)?.("password_mismatch", { email });
          setIsLoading(false);
          return;
        }

        const role = email.includes("admin") ? "admin" : "user";
        if (onLogin) {
          onLogin({ email, role });
          setIsDialogOpen(false);
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const openLoginDialog = () => {
    setActiveTab("login");
    setIsDialogOpen(true);
    (propTrackEvent || trackEvent)?.("open_login_dialog");
  };

  const openRegisterDialog = () => {
    setActiveTab("register");
    setIsDialogOpen(true);
    (propTrackEvent || trackEvent)?.("open_register_dialog");
  };

  const menuItems = [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-20 relative"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 bg-gradient-to-br from-rent-blue-500 to-rent-purple-600 rounded-lg flex items-center justify-center shadow-lg cursor-pointer"
          whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          onClick={() => (propTrackEvent || trackEvent)?.("logo_click")}
        >
          <BarChart3 className="w-6 h-6 text-white" />
        </motion.div>
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-rent-blue-600 to-rent-purple-600 bg-clip-text text-transparent cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => (propTrackEvent || trackEvent)?.("title_click")}
        >
          RentAnalytics
        </motion.h1>
      </div>
      
      {/* Navigation menu (visible on larger screens) */}
      <motion.nav 
        className="hidden md:flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {menuItems.map((item) => (
          <motion.a
            key={item.name}
            href={item.href}
            className="text-muted-foreground hover:text-foreground transition-colors relative"
            whileHover={{ y: -2 }}
            onClick={() => (propTrackEvent || trackEvent)?.("nav_click", { item: item.name })}
          >
            {item.name}
            <motion.div 
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rent-blue-500 to-rent-purple-500"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        ))}
      </motion.nav>
      
      {/* Mobile menu button (visible on smaller screens) */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            (propTrackEvent || trackEvent)?.("mobile_menu_toggle", { open: !isMenuOpen });
          }}
        >
          <motion.div 
            animate={{ rotate: isMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-0.5 bg-current mb-1"
          />
          <motion.div
            animate={{ 
              opacity: isMenuOpen ? 0 : 1,
              x: isMenuOpen ? 20 : 0
            }}
            transition={{ duration: 0.2 }}
            className="w-5 h-0.5 bg-current mb-1"
          />
          <motion.div
            animate={{ rotate: isMenuOpen ? -45 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-0.5 bg-current"
          />
        </Button>
      </div>
      
      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-lg md:hidden z-50"
          >
            <div className="flex flex-col p-4">
              {menuItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="py-2 text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    (propTrackEvent || trackEvent)?.("mobile_nav_click", { item: item.name });
                  }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) (propTrackEvent || trackEvent)?.("close_auth_dialog");
        }}>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={openLoginDialog}
                variant="outline"
                className="shadow-md hover:shadow-lg transition-all"
              >
                Connexion
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={openRegisterDialog}
                className="bg-gradient-to-r from-rent-blue-500 to-rent-purple-600 hover:from-rent-blue-600 hover:to-rent-purple-700 shadow-md hover:shadow-lg transition-all"
              >
                Inscription
              </Button>
            </motion.div>
          </div>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Accéder à RentAnalytics
              </DialogTitle>
              <motion.div 
                className="text-center text-muted-foreground"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Connectez-vous ou créez un compte pour commencer à analyser vos locations
              </motion.div>
            </DialogHeader>
            <div className="bg-card rounded-lg p-4 border shadow-lg">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                (propTrackEvent || trackEvent)?.("auth_tab_change", { tab: value });
              }}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="login">
                      <LoginForm 
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                      />
                    </TabsContent>
                    
                    <TabsContent value="register">
                      <RegisterForm 
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        isLoading={isLoading}
                        onSubmit={handleSubmit}
                      />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
        <ThemeToggle onClick={() => (propTrackEvent || trackEvent)?.("theme_toggle")} />
      </div>
    </motion.header>
  );
};
