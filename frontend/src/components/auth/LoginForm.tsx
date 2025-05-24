
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent, isLogin: boolean) => void;
}

export const LoginForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  isLoading, 
  onSubmit 
}: LoginFormProps) => {
  return (
    <motion.form 
      onSubmit={(e) => onSubmit(e, true)} 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        <div className="relative shadow-sm">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 transition-all focus:shadow-md"
            required
          />
        </div>
        <div className="relative shadow-sm">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 transition-all focus:shadow-md"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-rent-blue-500 to-rent-purple-600 hover:from-rent-blue-600 hover:to-rent-purple-700 shadow-md hover:shadow-lg transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        Utilisez "admin@test.com" pour les droits administrateur
      </p>
    </motion.form>
  );
};
