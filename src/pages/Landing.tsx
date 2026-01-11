import { useNavigate } from "react-router-dom";
import { CreditCard, Users, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Carte digitale moderne",
      description: "Créez une carte de visite numérique élégante en quelques minutes.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Partage instantané",
      description: "Partagez votre carte via un simple lien ou QR code.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Tous vos réseaux",
      description: "Regroupez tous vos réseaux sociaux en un seul endroit.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Gratuit",
      description: "Créez et gérez votre carte sans frais, pour toujours.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-white">DigiCard</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-100 transition-colors"
            >
              Créer ma carte
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Nouveau : Ajoutez WhatsApp et Telegram
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Votre carte de visite{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              digitale
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Créez gratuitement une carte de visite numérique professionnelle.
            Partagez vos coordonnées et réseaux sociaux en un clic.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="group flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-all hover:scale-105"
            >
              Créer ma carte gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/card/demo")}
              className="text-slate-300 hover:text-white transition-colors font-medium px-8 py-4"
            >
              Voir un exemple →
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-20 max-w-sm mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-1">Marie Martin</h3>
              <p className="text-slate-400 text-sm mb-4">Designer UX · Paris</p>
              <p className="text-slate-300 text-sm mb-6">
                Passionnée par le design et l'expérience utilisateur.
              </p>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à créer votre carte ?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui partagent déjà leur carte digitale.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-100 transition-colors"
            >
              Commencer maintenant
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-slate-400">
          <p>© 2024 DigiCard. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
