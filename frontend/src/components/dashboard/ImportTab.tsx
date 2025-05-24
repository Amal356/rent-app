
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Calendar,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ImportTab = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.name.toLowerCase();
    
    if (!fileType.endsWith('.csv') && !fileType.endsWith('.xls') && !fileType.endsWith('.xlsx')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez uploader un fichier CSV (Airbnb) ou XLS/XLSX (Booking.com)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulation du upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Import réussi",
            description: `${file.name} a été importé avec succès. ${Math.floor(Math.random() * 50 + 10)} réservations ajoutées.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Données de démonstration pour les imports précédents
  const importHistory = [
    {
      id: 1,
      filename: "airbnb_reservations_2024.csv",
      platform: "Airbnb",
      date: "2024-01-15",
      records: 24,
      status: "success"
    },
    {
      id: 2,
      filename: "booking_export_december.xlsx",
      platform: "Booking.com",
      date: "2024-01-10",
      records: 18,
      status: "success"
    },
    {
      id: 3,
      filename: "airbnb_Q4_2023.csv",
      platform: "Airbnb",
      date: "2024-01-05",
      records: 42,
      status: "success"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section d'upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-rent-blue-600" />
              Importer des fichiers de réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-rent-blue-500 bg-rent-blue-50' 
                  : 'border-gray-300 hover:border-rent-blue-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Glissez-déposez vos fichiers ici
              </h3>
              <p className="text-gray-600 mb-4">
                Ou cliquez pour sélectionner des fichiers
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => document.getElementById('csv-input')?.click()}
                >
                  <FileText className="w-4 h-4" />
                  Fichier CSV (Airbnb)
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => document.getElementById('xls-input')?.click()}
                >
                  <FileText className="w-4 h-4" />
                  Fichier XLS (Booking.com)
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Formats supportés: CSV, XLS, XLSX (max 10MB)
              </p>
              
              <input
                id="csv-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <input
                id="xls-input"
                type="file"
                accept=".xls,.xlsx"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Import en cours...</span>
                  <span className="text-sm text-gray-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-rent-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions d'import */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Instructions Airbnb (CSV)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Connectez-vous à votre compte Airbnb</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Accédez à "Performances" → "Réservations"</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Cliquez sur "Exporter" et sélectionnez CSV</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Uploadez le fichier téléchargé</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Instructions Booking.com (XLS)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Connectez-vous à l'Extranet Booking.com</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Allez dans "Réservations" → "Rapport"</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Sélectionnez la période et exportez en Excel</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">Uploadez le fichier XLS/XLSX</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des imports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Historique des imports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {importHistory.map((import_) => (
              <div key={import_.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-8 rounded ${import_.platform === 'Airbnb' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="font-medium">{import_.filename}</p>
                      <p className="text-sm text-gray-600">{import_.platform} • {import_.records} réservations</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{import_.date}</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques d'import */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total importé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rent-blue-600">84</div>
            <p className="text-sm text-gray-600">réservations ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dernière synchronisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">15 Jan</div>
            <p className="text-sm text-gray-600">il y a 2 jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fichiers traités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rent-purple-600">12</div>
            <p className="text-sm text-gray-600">imports réussis</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
