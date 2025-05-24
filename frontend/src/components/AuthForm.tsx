
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Building2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

interface AuthFormProps {
  onLogin: (user: { email: string; role: string }) => void;
}

export const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'authentification
    setTimeout(() => {
      if (email && password) {
        if (!isLogin && password !== confirmPassword) {
          toast({
            title: "Erreur",
            description: "Les mots de passe ne correspondent pas",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const role = email.includes("admin") ? "admin" : "user";
        onLogin({ email, role });
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${email}`,
        });
      } else {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Section gauche - Présentation */}
        <div className="text-center lg:text-left animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-rent-blue-500 to-rent-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rent-blue-600 to-rent-purple-600 bg-clip-text text-transparent">
              RentAnalytics
            </h1>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Analyse intelligente de vos 
            <span className="bg-gradient-to-r from-rent-blue-600 to-rent-purple-600 bg-clip-text text-transparent"> réservations</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Importez vos données Airbnb et Booking.com, visualisez vos performances et obtenez des prédictions IA pour optimiser vos revenus.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center lg:items-start">
              <Building2 className="w-8 h-8 text-rent-blue-500 dark:text-rent-blue-400 mb-2" />
              <h3 className="font-semibold text-foreground">Multi-plateformes</h3>
              <p className="text-sm text-muted-foreground text-center lg:text-left">Airbnb & Booking.com</p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <TrendingUp className="w-8 h-8 text-rent-purple-500 dark:text-rent-purple-400 mb-2" />
              <h3 className="font-semibold text-foreground">Prédictions IA</h3>
              <p className="text-sm text-muted-foreground text-center lg:text-left">Anticipez les périodes creuses</p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <BarChart3 className="w-8 h-8 text-rent-blue-500 dark:text-rent-blue-400 mb-2" />
              <h3 className="font-semibold text-foreground">Analytics avancés</h3>
              <p className="text-sm text-muted-foreground text-center lg:text-left">Tableaux de bord interactifs</p>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="animate-scale-in">
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-background/80 dark:bg-background/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Accéder à la plateforme</CardTitle>
              <CardDescription>
                Connectez-vous ou créez votre compte pour commencer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
                
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
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
