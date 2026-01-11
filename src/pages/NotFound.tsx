import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-slate-400 mb-8">Page non trouvée</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors"
        >
          <Home size={20} />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFound;
