import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calculator,
  Clock,
  ArrowRight,
  ExternalLink,
  Wrench
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  external?: boolean;
  available: boolean;
}

const Hub = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tools: Tool[] = [
    {
      id: "mycard",
      name: "MyCard",
      description: "Créez votre carte de visite digitale professionnelle. Partagez vos contacts et réseaux en un clic.",
      icon: <CreditCard className="w-8 h-8" />,
      href: "/mycard",
      available: true,
    },
    {
      id: "netsalaire",
      name: "NetSalaire",
      description: "Calculez votre salaire net à partir du brut. Simulez vos revenus en quelques secondes.",
      icon: <Calculator className="w-8 h-8" />,
      href: "https://www.netsalaire.com",
      external: true,
      available: true,
    },
    {
      id: "coming-1",
      name: "Bientôt disponible",
      description: "Un nouvel outil pour booster votre productivité arrive très bientôt.",
      icon: <Clock className="w-8 h-8" />,
      available: false,
    },
    {
      id: "coming-2",
      name: "Bientôt disponible",
      description: "Un nouvel outil pour booster votre productivité arrive très bientôt.",
      icon: <Clock className="w-8 h-8" />,
      available: false,
    },
    {
      id: "coming-3",
      name: "Bientôt disponible",
      description: "Un nouvel outil pour booster votre productivité arrive très bientôt.",
      icon: <Clock className="w-8 h-8" />,
      available: false,
    },
    {
      id: "coming-4",
      name: "Bientôt disponible",
      description: "Un nouvel outil pour booster votre productivité arrive très bientôt.",
      icon: <Clock className="w-8 h-8" />,
      available: false,
    },
  ];

  const handleToolClick = (tool: Tool) => {
    if (!tool.available || !tool.href) return;

    if (tool.external) {
      window.open(tool.href, "_blank", "noopener,noreferrer");
    } else {
      navigate(tool.href);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">75tools</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                2 outils disponibles
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Tous vos outils de productivité
            <br />
            <span className="text-blue-600">en un seul endroit</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-4">
            Des solutions gratuites pour augmenter votre performance et éclairer vos décisions.
          </p>
          <p className="text-sm text-slate-400">
            Gratuit • Sans inscription • Accessible à tous
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className={`
                  relative rounded-2xl p-6 transition-all duration-200
                  ${tool.available
                    ? "bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer group"
                    : "bg-slate-100 border border-slate-200 cursor-default"
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center mb-4
                  ${tool.available
                    ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                    : "bg-slate-200 text-slate-400"
                  }
                `}>
                  {tool.icon}
                </div>

                {/* Content */}
                <h3 className={`
                  text-lg font-semibold mb-2
                  ${tool.available ? "text-slate-900" : "text-slate-400"}
                `}>
                  {tool.name}
                </h3>
                <p className={`
                  text-sm leading-relaxed
                  ${tool.available ? "text-slate-600" : "text-slate-400"}
                `}>
                  {tool.description}
                </p>

                {/* Action indicator */}
                {tool.available && (
                  <div className="mt-4 flex items-center gap-1 text-blue-600 text-sm font-medium">
                    <span>Accéder</span>
                    {tool.external ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                )}

                {/* Coming soon badge */}
                {!tool.available && (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-200 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      Bientôt
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          <p>© 2025 75tools. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Hub;
