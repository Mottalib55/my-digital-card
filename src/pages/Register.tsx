import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Mail, Lock, Loader2, ArrowLeft, User, Phone, Briefcase, Instagram, Linkedin, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate username
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("Le nom d'utilisateur ne peut contenir que des lettres minuscules, chiffres et underscores.");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères.");
      setLoading(false);
      return;
    }

    // Check if username is already taken
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existingProfile) {
      setError("Ce nom d'utilisateur est déjà pris.");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("Cet email est déjà utilisé.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      setLoading(false);
      return;
    }

    // Get the new user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Create profile with first and last name
      await supabase.from("profiles").insert({
        user_id: user.id,
        username: username,
        email_contact: email,
        first_name: firstName,
        last_name: lastName,
      });
    }

    navigate("/dashboard");
    setLoading(false);
  };

  // Get initials for avatar
  const getInitials = () => {
    const f = firstName?.[0]?.toUpperCase() || "";
    const l = lastName?.[0]?.toUpperCase() || "";
    return f + l || "?";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/mycard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Form Column */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-slate-900" />
                </div>
                <span className="text-xl font-bold text-white">MyCard</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Créez votre carte
            </h1>
            <p className="text-slate-400 text-center mb-6">
              Gratuit et en quelques secondes
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="jeandupont"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  75tools.fr/card/<span className="text-blue-400">{username || "votrenom"}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@exemple.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Minimum 6 caractères</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer ma carte gratuitement"
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-slate-400 text-center mt-5 text-sm">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-white hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>

          {/* Preview Column */}
          <div className="hidden lg:block">
            <p className="text-slate-400 text-sm text-center mb-4">Aperçu de votre carte</p>

            {/* Card Preview */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-auto transform hover:scale-[1.02] transition-transform duration-300">
              {/* Avatar */}
              <div className="flex justify-center mb-5">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {getInitials()}
                </div>
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-slate-900 text-center mb-1">
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : "Votre Nom"}
              </h2>

              {/* Title placeholder */}
              <p className="text-slate-500 text-center text-sm mb-4">
                Votre titre professionnel
              </p>

              {/* Contact Info placeholders */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <Phone size={14} />
                  </div>
                  <span className="text-slate-400 text-sm">+33 6 XX XX XX XX</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <Mail size={14} />
                  </div>
                  <span className="text-slate-400 text-sm">{email || "votre@email.com"}</span>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <Briefcase size={14} />
                  </div>
                  <span className="text-slate-400 text-sm">Votre entreprise</span>
                </div>
              </div>

              {/* Social Icons placeholders */}
              <div className="flex justify-center gap-3 mb-5">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Linkedin size={18} />
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Instagram size={18} />
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <Globe size={18} />
                </div>
              </div>

              {/* Add Contact Button */}
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium">
                Ajouter aux contacts
              </button>

              {/* URL */}
              <p className="text-center text-xs text-slate-400 mt-4">
                75tools.fr/card/<span className="text-blue-500">{username || "votrenom"}</span>
              </p>
            </div>

            {/* Features */}
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400">Gratuit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">30s</div>
                <div className="text-xs text-slate-400">Pour créer</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">QR</div>
                <div className="text-xs text-slate-400">Code inclus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
