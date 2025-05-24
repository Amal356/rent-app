
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isPageLoaded: boolean;
  scrollToFeatures: () => void;
}

export const HeroSection = ({ isPageLoaded, scrollToFeatures }: HeroSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-12 lg:py-0"
    >
      <motion.h2 
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.span 
          className="block"
          whileHover={{ scale: 1.05, color: "#4f46e5" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Analyse intelligente
        </motion.span>
        <motion.span 
          className="block text-rent-purple-600 dark:text-rent-purple-400"
          whileHover={{ scale: 1.05, x: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          de vos réservations
        </motion.span>
      </motion.h2>

      <motion.p 
        className="text-xl text-muted-foreground mb-8 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        whileHover={{ scale: 1.02 }}
      >
        Optimisez votre activité Airbnb et Booking.com grâce à notre plateforme d'analyse avec IA intégrée
      </motion.p>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-rent-blue-600 to-rent-purple-600 hover:from-rent-blue-700 hover:to-rent-purple-700 text-white px-8 py-6 rounded-lg flex items-center gap-2 transform transition-transform"
          >
            <span>Commencer maintenant</span> 
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="ml-1 h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 border-2 border-rent-blue-200 dark:border-rent-blue-800 text-rent-blue-700 dark:text-rent-blue-300 hover:bg-rent-blue-50 dark:hover:bg-rent-blue-900/40 rounded-lg"
            onClick={scrollToFeatures}
          >
            En savoir plus
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
