
import { motion } from "framer-motion";
import { BarChart3, Clock, Globe2, ShieldCheck, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/utils/analytics";

export const FeaturesSection = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  
  const features = [
    {
      icon: <BarChart3 className="w-12 h-12 text-rent-blue-600" />,
      title: "Analyse intelligente",
      description: "Visualisez vos données de réservation avec des graphiques interactifs et des statistiques précises",
      hoverDescription: "Obtenez des insights précis sur vos performances, taux d'occupation et revenus avec nos tableaux de bord personnalisés."
    },
    {
      icon: <Globe2 className="w-12 h-12 text-rent-purple-600" />,
      title: "Multi-plateformes",
      description: "Compatible avec Airbnb et Booking.com pour centraliser vos données",
      hoverDescription: "Connectez facilement vos comptes Airbnb, Booking.com, VRBO et plus encore pour une analyse complète et centralisée."
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-rent-blue-600" />,
      title: "Sécurisé",
      description: "Vos données sont protégées avec un système d'authentification avancé",
      hoverDescription: "Protection de niveau bancaire pour vos données sensibles avec chiffrement de bout en bout et authentification multi-facteurs."
    },
    {
      icon: <Clock className="w-12 h-12 text-rent-purple-600" />,
      title: "Prédictions IA",
      description: "Anticipez les périodes creuses grâce à notre intelligence artificielle",
      hoverDescription: "Notre IA analyse les tendances saisonnières, événements locaux et données historiques pour prédire la demande future avec précision."
    },
  ];

  return (
    <motion.section 
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Fonctionnalités principales
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            Découvrez comment RentAnalytics peut transformer votre gestion de réservations
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-background/50 dark:bg-muted/10 p-6 rounded-xl border border-border hover:shadow-xl transition-all relative overflow-hidden cursor-pointer"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              onHoverStart={() => {
                setHoveredFeature(index);
                trackEvent("feature_hover", { feature: feature.title });
              }}
              onHoverEnd={() => setHoveredFeature(null)}
              onTap={() => trackEvent("feature_tap", { feature: feature.title })}
            >
              <motion.div 
                className="mb-4"
                animate={{ 
                  rotate: hoveredFeature === index ? [0, 15, -15, 0] : 0,
                  scale: hoveredFeature === index ? 1.2 : 1
                }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              
              <motion.div
                className="relative h-20"
                animate={{ y: hoveredFeature === index ? -100 : 0, opacity: hoveredFeature === index ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
              
              <motion.div
                className="absolute bottom-6 left-6 right-6"
                initial={{ y: 100, opacity: 0 }}
                animate={{ 
                  y: hoveredFeature === index ? 0 : 100,
                  opacity: hoveredFeature === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-muted-foreground">{feature.hoverDescription}</p>
                <motion.div 
                  className="flex items-center text-rent-purple-600 dark:text-rent-purple-400 mt-2 font-medium"
                  animate={{ x: hoveredFeature === index ? [0, 5, 0] : 0 }}
                  transition={{ repeat: hoveredFeature === index ? Infinity : 0, duration: 1.5 }}
                >
                  <span className="mr-1">En savoir plus</span>
                  <MousePointerClick size={16} />
                </motion.div>
              </motion.div>
              
              {/* Interactive spotlight effect */}
              <motion.div 
                className="absolute -inset-0.5 bg-gradient-to-r from-rent-blue-500/20 to-rent-purple-500/20 rounded-xl opacity-0"
                animate={{ opacity: hoveredFeature === index ? 0.8 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: -1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
