
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  LogOut, 
  Upload, 
  Building2, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Users,
  FileText,
  Download,
  Brain,
  Home,
  User,
  Shield
} from "lucide-react";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { PropertiesTab } from "@/components/dashboard/PropertiesTab";
import { ImportTab } from "@/components/dashboard/ImportTab";
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardProps {
  user: { email: string; role: string } | null;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
    onLogout();
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-rent-blue-500 to-rent-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rent-blue-600 to-rent-purple-600 bg-clip-text text-transparent">
                RentAnalytics
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                {isAdmin ? (
                  <Shield className="w-4 h-4 text-rent-purple-600 dark:text-rent-purple-400" />
                ) : (
                  <User className="w-4 h-4 text-rent-blue-600 dark:text-rent-blue-400" />
                )}
                <span className="text-sm font-medium text-foreground">{user?.email}</span>
                {isAdmin && (
                  <span className="text-xs bg-rent-purple-100 dark:bg-rent-purple-900 text-rent-purple-700 dark:text-rent-purple-300 px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Tableau de bord
          </h2>
          <p className="text-muted-foreground">
            Vue d'ensemble de vos réservations et performances
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <Home className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <Building2 className="w-4 h-4" />
              Logements
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="import" className="gap-2">
                <Upload className="w-4 h-4" />
                Import
              </TabsTrigger>
            )}
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab isAdmin={isAdmin} />
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <PropertiesTab isAdmin={isAdmin} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="import" className="space-y-6">
              <ImportTab />
            </TabsContent>
          )}

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
