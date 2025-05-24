
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent, isLogin: boolean) => void;
}

export const RegisterForm = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit
}: RegisterFormProps) => {
  return (
    <motion.form 
      onSubmit={(e) => onSubmit(e, false)} 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        <div className="relative shadow-sm">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Nom complet"
            className="pl-10 transition-all focus:shadow-md"
            required
          />
        </div>
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
        <div className="relative shadow-sm">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        {isLoading ? "Création..." : "Créer un compte"}
      </Button>
    </motion.form>
  );
};
