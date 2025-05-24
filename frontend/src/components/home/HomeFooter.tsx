
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { trackEvent } from "@/utils/analytics";

interface HomeFooterProps {
  trackEvent?: (eventName: string, eventData?: Record<string, any>) => void;
}

export const HomeFooter = ({ trackEvent: propTrackEvent }: HomeFooterProps) => {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSocialClick = (platform: string) => {
    (propTrackEvent || trackEvent)?.("social_click", { platform });
    // Here we would normally navigate to social platform
  };

  const handleSocialHover = (platform: string) => {
    setHoveredSocial(platform);
    (propTrackEvent || trackEvent)?.("social_hover", { platform });
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackMessage.trim()) {
      (propTrackEvent || trackEvent)?.("feedback_submitted", { length: feedbackMessage.length });
      setFeedbackMessage("");
      setShowFeedback(false);
      // Normally we would send this feedback to a server
    }
  };

  return (
    <motion.footer
      className="bg-muted/50 dark:bg-muted/10 py-12 px-4 sm:px-6 lg:px-8 shadow-lg relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Interactive background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-rent-blue-400/10 dark:bg-rent-blue-700/10 rounded-full"
          animate={{ 
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-rent-purple-400/10 dark:bg-rent-purple-700/10 rounded-full"
          animate={{ 
            x: [0, -15, 15, 0],
            y: [0, 15, -15, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div 
          className="inline-block mb-6"
          whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => (propTrackEvent || trackEvent)?.("footer_logo_click")}
        >
          <h3 className="text-xl font-bold bg-gradient-to-r from-rent-blue-600 to-rent-purple-600 bg-clip-text text-transparent cursor-pointer">
            RentAnalytics
          </h3>
        </motion.div>
        
        {/* Social Media Links with enhanced interactivity */}
        <div className="flex justify-center space-x-4 mb-6">
          {[
            { name: "facebook", icon: <Facebook className="h-5 w-5" />, color: "from-blue-500 to-blue-700" },
            { name: "twitter", icon: <Twitter className="h-5 w-5" />, color: "from-cyan-500 to-blue-500" },
            { name: "instagram", icon: <Instagram className="h-5 w-5" />, color: "from-amber-500 to-purple-600" },
            { name: "linkedin", icon: <Linkedin className="h-5 w-5" />, color: "from-blue-600 to-blue-800" }
          ].map((social) => (
            <motion.a
              key={social.name}
              href="#"
              aria-label={social.name}
              className="relative bg-muted/70 p-2 rounded-full hover:text-rent-blue-600 dark:hover:text-rent-blue-400 transition-colors"
              whileHover={{ scale: 1.2, rotate: social.name === "instagram" ? 15 : -15 }}
              onHoverStart={() => handleSocialHover(social.name)}
              onHoverEnd={() => setHoveredSocial(null)}
              onClick={() => handleSocialClick(social.name)}
            >
              {social.icon}
              <AnimatePresence>
                {hoveredSocial === social.name && (
                  <motion.span 
                    className={`absolute bottom-full mb-2 text-xs bg-gradient-to-r ${social.color} text-white px-2 py-1 rounded whitespace-nowrap`}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    Suivez-nous sur {social.name.charAt(0).toUpperCase() + social.name.slice(1)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.a>
          ))}
        </div>
        
        {/* Add site navigation links with enhanced interactivity */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8 text-sm">
          {[
            { name: "Accueil", link: "accueil" },
            { name: "Fonctionnalités", link: "fonctionnalites" },
            { name: "Tarifs", link: "tarifs" },
            { name: "Blog", link: "blog" },
            { name: "Contact", link: "contact" }
          ].map((item) => (
            <motion.a 
              key={item.link}
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors relative"
              whileHover={{ y: -2 }}
              onClick={() => (propTrackEvent || trackEvent)?.("footer_link_click", { link: item.link })}
            >
              <span>{item.name}</span>
              <motion.div 
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rent-blue-500 to-rent-purple-500"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>
        
        {/* Add interactive feedback button */}
        <div className="mb-6">
          <motion.button
            onClick={() => setShowFeedback(!showFeedback)}
            className="flex items-center gap-2 mx-auto px-3 py-1 text-sm bg-muted/80 rounded-full hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={14} />
            <span>Donnez votre avis</span>
          </motion.button>
          
          <AnimatePresence>
            {showFeedback && (
              <motion.form
                onSubmit={handleSubmitFeedback}
                className="mt-4 max-w-md mx-auto"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full p-2 rounded border border-border bg-background/70 text-sm mb-2"
                  placeholder="Partagez vos impressions sur notre site..."
                  rows={3}
                />
                <motion.button
                  type="submit"
                  className="bg-rent-purple-600 hover:bg-rent-purple-700 text-white px-4 py-1 rounded text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!feedbackMessage.trim()}
                >
                  Envoyer
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-muted-foreground mb-4">© {new Date().getFullYear()} RentAnalytics. Tous droits réservés.</p>
        <p className="text-muted-foreground/80 text-sm">
          Une solution d'analyse intelligente pour les hôtes Airbnb et Booking
        </p>
        
        {/* Add privacy links with hover effects */}
        <div className="flex justify-center space-x-4 mt-4 text-xs text-muted-foreground/70">
          {[
            { name: "Politique de confidentialité", link: "confidentialite" },
            { name: "Conditions d'utilisation", link: "conditions" },
            { name: "Cookies", link: "cookies" }
          ].map((item, index) => (
            <React.Fragment key={item.link}>
              {index > 0 && <span>•</span>}
              <motion.a 
                href="#" 
                className="hover:text-foreground transition-colors relative"
                whileHover={{ y: -1 }}
                onClick={() => (propTrackEvent || trackEvent)?.("footer_link_click", { link: item.link })}
              >
                <span>{item.name}</span>
                <motion.div 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rent-blue-500 to-rent-purple-500"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};
