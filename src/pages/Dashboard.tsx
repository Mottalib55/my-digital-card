import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save, LogOut, Upload, User, Phone, Mail, Briefcase, ExternalLink,
  Linkedin, Twitter, Instagram, Github, Facebook, Youtube,
  Globe, MessageCircle, Send, Music2, Camera, Link, Copy, Check, CreditCard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Profile } from "@/lib/supabase";

interface SocialField {
  value: string;
  enabled: boolean;
}

interface FieldConfig {
  key: string;
  dbKey: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
      if (data.avatar_url) {
        setAvatarPreview(data.avatar_url);
      }
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    let avatarUrl = profile.avatar_url;

    // Upload avatar if changed
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
        avatarUrl = data.publicUrl;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        ...profile,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getCardUrl = () => {
    return `${window.location.origin}${import.meta.env.BASE_URL}#/card/${profile.username}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getCardUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactFields: FieldConfig[] = [
    { key: "phone", dbKey: "phone", label: "Téléphone", icon: <Phone size={18} />, placeholder: "+33 6 12 34 56 78", type: "tel" },
    { key: "email", dbKey: "email_contact", label: "Email", icon: <Mail size={18} />, placeholder: "contact@exemple.com", type: "email" },
    { key: "website", dbKey: "website", label: "Site web", icon: <Globe size={18} />, placeholder: "https://monsite.com", type: "url" },
  ];

  const professionalFields: FieldConfig[] = [
    { key: "linkedin", dbKey: "linkedin", label: "LinkedIn", icon: <Linkedin size={18} />, placeholder: "https://linkedin.com/in/username" },
  ];

  const socialFields: FieldConfig[] = [
    { key: "twitter", dbKey: "twitter", label: "Twitter / X", icon: <Twitter size={18} />, placeholder: "https://twitter.com/username" },
    { key: "instagram", dbKey: "instagram", label: "Instagram", icon: <Instagram size={18} />, placeholder: "https://instagram.com/username" },
    { key: "facebook", dbKey: "facebook", label: "Facebook", icon: <Facebook size={18} />, placeholder: "https://facebook.com/username" },
    { key: "tiktok", dbKey: "tiktok", label: "TikTok", icon: <Music2 size={18} />, placeholder: "https://tiktok.com/@username" },
    { key: "youtube", dbKey: "youtube", label: "YouTube", icon: <Youtube size={18} />, placeholder: "https://youtube.com/@username" },
    { key: "snapchat", dbKey: "snapchat", label: "Snapchat", icon: <Camera size={18} />, placeholder: "username" },
  ];

  const techFields: FieldConfig[] = [
    { key: "github", dbKey: "github", label: "GitHub", icon: <Github size={18} />, placeholder: "https://github.com/username" },
  ];

  const messagingFields: FieldConfig[] = [
    { key: "whatsapp", dbKey: "whatsapp", label: "WhatsApp", icon: <MessageCircle size={18} />, placeholder: "+33612345678", type: "tel" },
    { key: "telegram", dbKey: "telegram", label: "Telegram", icon: <Send size={18} />, placeholder: "@username" },
  ];

  const renderFieldGroup = (title: string, fields: FieldConfig[]) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2">
        {fields.map((field) => {
          const value = (profile as any)[field.dbKey] || "";
          const enabled = (profile as any)[`${field.dbKey}_enabled`] ?? false;
          return (
            <div
              key={field.key}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                enabled ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-slate-100"
              }`}
            >
              <button
                type="button"
                onClick={() => handleChange(`${field.dbKey}_enabled`, !enabled)}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  enabled ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-400"
                }`}
              >
                {field.icon}
              </button>
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                <input
                  type={field.type || "url"}
                  value={value}
                  onChange={(e) => handleChange(field.dbKey, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={!enabled}
                  className={`w-full text-sm bg-transparent border-0 p-0 focus:ring-0 outline-none ${
                    enabled ? "text-slate-900" : "text-slate-400"
                  }`}
                />
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleChange(`${field.dbKey}_enabled`, !enabled)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">DigiCard</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(getCardUrl(), "_blank")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Voir ma carte</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 md:p-8">
        {/* Share Link */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="font-semibold mb-2">Votre lien de carte</h2>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl p-3">
            <span className="flex-1 text-sm truncate">
              {getCardUrl()}
            </span>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 bg-white text-slate-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copié !" : "Copier"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Identité */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User size={20} className="text-slate-400" />
              <h2 className="font-semibold text-slate-900">Identité</h2>
            </div>

            {/* Photo */}
            <div className="flex items-center gap-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                  <Upload size={24} className="text-slate-300" />
                </div>
              )}
              <div className="space-y-2">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Upload size={16} />
                  Choisir une photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400">JPG, PNG. Max 2MB</p>
              </div>
            </div>

            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Prénom</label>
                <input
                  type="text"
                  value={profile.first_name || ""}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="Jean"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Nom</label>
                <input
                  type="text"
                  value={profile.last_name || ""}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Dupont"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Titre & Entreprise */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Titre / Poste</label>
                <input
                  type="text"
                  value={profile.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Développeur Web"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Entreprise</label>
                <input
                  type="text"
                  value={profile.company || ""}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Ma Société"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Bio</label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Une courte description de vous..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition resize-none text-sm"
              />
            </div>
          </div>

          {/* Section: Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Phone size={20} className="text-slate-400" />
              <h2 className="font-semibold text-slate-900">Contact</h2>
            </div>
            {renderFieldGroup("Coordonnées", contactFields)}
          </div>

          {/* Section: Réseaux Professionnels */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Briefcase size={20} className="text-slate-400" />
              <h2 className="font-semibold text-slate-900">Professionnel</h2>
            </div>
            {renderFieldGroup("Réseaux professionnels", professionalFields)}
          </div>

          {/* Section: Réseaux Sociaux */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Link size={20} className="text-slate-400" />
              <h2 className="font-semibold text-slate-900">Réseaux Sociaux</h2>
            </div>
            {renderFieldGroup("Plateformes sociales", socialFields)}
            {renderFieldGroup("Tech & Dev", techFields)}
            {renderFieldGroup("Messagerie", messagingFields)}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 font-medium py-4 px-6 rounded-xl transition-all shadow-lg ${
              saved
                ? "bg-green-500 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xl"
            }`}
          >
            <Save size={20} />
            {saving ? "Enregistrement..." : saved ? "Enregistré !" : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
