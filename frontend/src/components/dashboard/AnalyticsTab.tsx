import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Users, 
  MousePointer, 
  Clock, 
  RefreshCw,
  Trash2,
  LineChart,
  Eye,
} from "lucide-react";
import { getAnalyticsSummary, getPageViewsByPath, resetAnalytics, VisitData, EventData } from "@/utils/analytics";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const AnalyticsTab = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsData, setAnalyticsData] = useState<ReturnType<typeof getAnalyticsSummary> | null>(null);
  const [pageViews, setPageViews] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // Load analytics data
  const loadAnalytics = () => {
    const summary = getAnalyticsSummary();
    const views = getPageViewsByPath();
    setAnalyticsData(summary);
    setPageViews(views);
  };

  // Reset analytics data
  const handleResetAnalytics = () => {
    resetAnalytics();
    loadAnalytics();
    toast({
      title: "Données réinitialisées",
      description: "Toutes les données d'analyse ont été supprimées",
    });
  };

  // Refresh analytics data
  const handleRefreshAnalytics = () => {
    loadAnalytics();
    toast({
      title: "Données actualisées",
      description: "Les données d'analyse ont été actualisées",
    });
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Suivi du site</h3>
        <div className="flex space-x-2">
          <Button onClick={handleRefreshAnalytics} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Actualiser
          </Button>
          <Button onClick={handleResetAnalytics} variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" /> Réinitialiser
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="visits" className="gap-2">
            <Eye className="w-4 h-4" />
            Visites
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <MousePointer className="w-4 h-4" />
            Événements
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Nombre de visites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">{analyticsData?.totalVisits || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pages uniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <LineChart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">{analyticsData?.uniquePages || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Événements totaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MousePointer className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold">
                      {Object.values(analyticsData?.eventCounts || {}).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Vues par page</CardTitle>
                  <CardDescription>Nombre de visites par page</CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(pageViews).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(pageViews).map(([page, count]) => (
                        <div key={page} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground font-mono">
                              {page || "/"}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Aucune donnée disponible
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Événements populaires</CardTitle>
                  <CardDescription>Fréquence des événements</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData && Object.keys(analyticsData.eventCounts).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(analyticsData.eventCounts).map(([event, count]) => (
                        <div key={event} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground">
                              {event.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      Aucune donnée disponible
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Visits Tab */}
        <TabsContent value="visits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dernières visites</CardTitle>
              <CardDescription>Historique des visites du site</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData?.recentVisits && analyticsData.recentVisits.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.recentVisits.map((visit: VisitData, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-md p-4 space-y-2"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <Eye className="h-4 w-4" />
                          <span>{visit.page || "/"}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(visit.timestamp)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="block font-medium">Référent</span>
                          <span className="block truncate">{visit.referrer || "Direct"}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Appareil</span>
                          <span className="block truncate">{
                            visit.userAgent.includes("Mobile") ? "Mobile" : "Desktop"
                          }</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Aucune visite enregistrée
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Derniers événements</CardTitle>
              <CardDescription>Historique des interactions utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData?.recentEvents && analyticsData.recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.recentEvents.map((event: EventData, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-md p-4 space-y-2"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2 text-sm font-medium">
                          <MousePointer className="h-4 w-4" />
                          <span>{event.event.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div>
                          <span className="block font-medium text-muted-foreground">Données</span>
                          <code className="block bg-muted/50 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(event.data, null, 2)}
                          </code>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="block font-medium">Page</span>
                        <span>{event.page || "/"}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Aucun événement enregistré
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
