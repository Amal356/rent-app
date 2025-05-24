
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Star, 
  Users,
  DollarSign
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PropertiesTabProps {
  isAdmin: boolean;
}

export const PropertiesTab = ({ isAdmin }: PropertiesTabProps) => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Appartement Centre-ville",
      location: "Paris 1er",
      platform: "Airbnb",
      status: "Actif",
      rating: 4.8,
      reservations: 24,
      revenue: "15,680€"
    },
    {
      id: 2,
      name: "Maison avec jardin",
      location: "Lyon 3ème",
      platform: "Booking.com",
      status: "Actif",
      rating: 4.6,
      reservations: 18,
      revenue: "12,450€"
    },
    {
      id: 3,
      name: "Studio moderne",
      location: "Marseille",
      platform: "Airbnb",
      status: "Maintenance",
      rating: 4.9,
      reservations: 32,
      revenue: "19,200€"
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    location: "",
    platform: "",
  });

  const { toast } = useToast();

  const handleAddProperty = () => {
    if (newProperty.name && newProperty.location && newProperty.platform) {
      const property = {
        id: properties.length + 1,
        ...newProperty,
        status: "Actif",
        rating: 0,
        reservations: 0,
        revenue: "0€"
      };
      setProperties([...properties, property]);
      setNewProperty({ name: "", location: "", platform: "" });
      setIsAddDialogOpen(false);
      toast({
        title: "Logement ajouté",
        description: `${newProperty.name} a été ajouté avec succès`,
      });
    }
  };

  const handleDeleteProperty = (id: number) => {
    setProperties(properties.filter(p => p.id !== id));
    toast({
      title: "Logement supprimé",
      description: "Le logement a été supprimé avec succès",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestion des logements</h3>
          <p className="text-gray-600">Gérez vos propriétés et suivez leurs performances</p>
        </div>
        
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-rent-blue-500 to-rent-purple-600 hover:from-rent-blue-600 hover:to-rent-purple-700">
                <Plus className="w-4 h-4" />
                Ajouter un logement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau logement</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau logement à votre portefeuille
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du logement</Label>
                  <Input
                    id="name"
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                    placeholder="Ex: Appartement Centre-ville"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={newProperty.location}
                    onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                    placeholder="Ex: Paris 1er"
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Plateforme</Label>
                  <Select value={newProperty.platform} onValueChange={(value) => setNewProperty({ ...newProperty, platform: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Airbnb">Airbnb</SelectItem>
                      <SelectItem value="Booking.com">Booking.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddProperty} className="w-full">
                  Ajouter le logement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Liste des logements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-rent-blue-600" />
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                </div>
                <Badge 
                  variant={property.status === "Actif" ? "default" : "secondary"}
                  className={property.status === "Actif" ? "bg-green-100 text-green-800" : ""}
                >
                  {property.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{property.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={property.platform === "Airbnb" ? "border-red-200 text-red-700" : "border-blue-200 text-blue-700"}>
                  {property.platform}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm">{property.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Réservations</span>
                  </div>
                  <p className="text-lg font-semibold text-rent-blue-600">{property.reservations}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Revenus</span>
                  </div>
                  <p className="text-lg font-semibold text-green-600">{property.revenue}</p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Edit className="w-3 h-3" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteProperty(property.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques des logements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Note moyenne:</span>
                <span className="font-semibold">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span>Taux d'occupation:</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex justify-between">
                <span>Revenus moyens/mois:</span>
                <span className="font-semibold">4,890€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Airbnb:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-3/5 h-full bg-red-500 rounded"></div>
                  </div>
                  <span className="text-sm">60%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Booking.com:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded">
                    <div className="w-2/5 h-full bg-blue-500 rounded"></div>
                  </div>
                  <span className="text-sm">40%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Building2 className="w-8 h-8 text-rent-blue-600 mx-auto mb-2" />
              <p className="font-semibold">Studio moderne</p>
              <p className="text-sm text-gray-600">19,200€ de revenus</p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                ⭐ Top performer
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
