
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp, 
  Building2,
  FileText,
  Download,
  Brain
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface OverviewTabProps {
  isAdmin: boolean;
}

export const OverviewTab = ({ isAdmin }: OverviewTabProps) => {
  // Données de démonstration
  const monthlyRevenue = [
    { month: "Jan", airbnb: 4500, booking: 3200 },
    { month: "Fév", airbnb: 5200, booking: 3800 },
    { month: "Mar", airbnb: 4800, booking: 4100 },
    { month: "Avr", airbnb: 6100, booking: 4500 },
    { month: "Mai", airbnb: 7200, booking: 5200 },
    { month: "Jun", airbnb: 8100, booking: 5800 },
  ];

  const platformData = [
    { name: "Airbnb", value: 65, color: "#FF5A5F" },
    { name: "Booking.com", value: 35, color: "#003580" },
  ];

  const reservationsData = [
    { month: "Jan", reservations: 12 },
    { month: "Fév", reservations: 15 },
    { month: "Mar", reservations: 18 },
    { month: "Avr", reservations: 22 },
    { month: "Mai", reservations: 28 },
    { month: "Jun", reservations: 32 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rent-blue-600">47 890 €</div>
            <p className="text-xs text-muted-foreground">
              +12.5% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rent-purple-600">127</div>
            <p className="text-xs text-muted-foreground">
              +8 nouvelles cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">78.5%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logements actifs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
            <p className="text-xs text-muted-foreground">
              2 Airbnb, 3 Booking.com
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="airbnb" 
                  stroke="#FF5A5F" 
                  strokeWidth={3}
                  name="Airbnb"
                />
                <Line 
                  type="monotone" 
                  dataKey="booking" 
                  stroke="#003580" 
                  strokeWidth={3}
                  name="Booking.com"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-rent-purple-600" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAdmin && (
              <Button className="h-auto p-4 flex flex-col items-center gap-2 bg-gradient-to-r from-rent-blue-500 to-rent-blue-600 hover:from-rent-blue-600 hover:to-rent-blue-700">
                <FileText className="w-6 h-6" />
                <span>Importer des données</span>
              </Button>
            )}
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-rent-purple-50">
              <Brain className="w-6 h-6 text-rent-purple-600" />
              <span>Prédiction IA</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50">
              <Download className="w-6 h-6 text-green-600" />
              <span>Exporter rapport</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Récentes réservations */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: "RB001", guest: "Marie Dupont", property: "Appartement Centre-ville", checkin: "2024-01-15", amount: "580€", platform: "Airbnb" },
              { id: "BK002", guest: "Jean Martin", property: "Maison avec jardin", checkin: "2024-01-18", amount: "750€", platform: "Booking.com" },
              { id: "RB003", guest: "Sophie Bernard", property: "Studio moderne", checkin: "2024-01-20", amount: "320€", platform: "Airbnb" },
            ].map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-8 rounded ${reservation.platform === 'Airbnb' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="font-medium">{reservation.guest}</p>
                    <p className="text-sm text-gray-600">{reservation.property}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{reservation.amount}</p>
                  <p className="text-sm text-gray-600">{reservation.checkin}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
