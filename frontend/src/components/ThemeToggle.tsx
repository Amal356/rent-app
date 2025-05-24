
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { attachThemeToggleTracking } from "@/utils/analytics";

interface ThemeToggleProps {
  onClick?: () => void;
}

export function ThemeToggle({ onClick }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  // Handle the theme change with tracking
  const handleThemeChange = attachThemeToggleTracking(setTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted relative overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClick?.();
          }}
        >
          <motion.div
            animate={{ 
              rotate: theme === "dark" ? 45 : 0,
              scale: theme === "dark" ? 0 : 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
          <motion.div
            animate={{ 
              rotate: theme === "light" ? -45 : 0,
              scale: theme === "light" ? 0 : 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="absolute"
          >
            <Moon className="h-5 w-5" />
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {["light", "dark", "system"].map((themeOption) => (
          <DropdownMenuItem 
            key={themeOption} 
            onClick={() => handleThemeChange(themeOption)}
            className="cursor-pointer"
          >
            <motion.div 
              className="flex items-center w-full"
              whileHover={{ x: 2 }}
            >
              <motion.span
                className={`mr-2 h-2 w-2 rounded-full ${theme === themeOption ? "bg-rent-purple-500" : "bg-transparent border border-muted-foreground"}`}
                animate={{ 
                  scale: theme === themeOption ? [1, 1.5, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              ></motion.span>
              {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
            </motion.div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
