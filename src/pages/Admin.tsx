import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save, ArrowLeft, Upload, User, Phone, Mail, Briefcase,
  Linkedin, Twitter, Instagram, Github, Facebook, Youtube,
  Globe, MessageCircle, Send, Music2, Camera, Link
} from "lucide-react";

export interface SocialField {
  value: string;
  enabled: boolean;
}

export interface CardData {
  // Identité
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;

  // Contact
  phone: SocialField;
  email: SocialField;
  website: SocialField;

  // Réseaux professionnels
  linkedin: SocialField;

  // Réseaux sociaux
  twitter: SocialField;
  instagram: SocialField;
  facebook: SocialField;
  tiktok: SocialField;
  youtube: SocialField;
  snapchat: SocialField;

  // Tech & Dev
  github: SocialField;

  // Messagerie
  whatsapp: SocialField;
  telegram: SocialField;
}

const defaultField: SocialField = { value: "", enabled: false };

const defaultData: CardData = {
  firstName: "",
  lastName: "",
  title: "",
  company: "",
  bio: "",
  avatar: "",
  phone: { value: "", enabled: false },
  email: { value: "", enabled: false },
  website: { value: "", enabled: false },
  linkedin: { value: "", enabled: false },
  twitter: { value: "", enabled: false },
  instagram: { value: "", enabled: false },
  facebook: { value: "", enabled: false },
  tiktok: { value: "", enabled: false },
  youtube: { value: "", enabled: false },
  snapchat: { value: "", enabled: false },
  github: { value: "", enabled: false },
  whatsapp: { value: "", enabled: false },
  telegram: { value: "", enabled: false },
};

interface FieldConfig {
  key: keyof CardData;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CardData>(defaultData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cardData");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration des anciennes données
      const migrated = { ...defaultData };
      Object.keys(parsed).forEach((key) => {
        if (key in migrated) {
          const value = parsed[key];
          if (typeof value === "string" && key in defaultData && typeof (defaultData as any)[key] === "object") {
            (migrated as any)[key] = { value, enabled: !!value };
          } else {
            (migrated as any)[key] = value;
          }
        }
      });
      setFormData(migrated);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (key: keyof CardData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as SocialField), value },
    }));
  };

  const handleFieldToggle = (key: keyof CardData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as SocialField), enabled: !(prev[key] as SocialField).enabled },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cardData", JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const contactFields: FieldConfig[] = [
    { key: "phone", label: "Téléphone", icon: <Phone size={18} />, placeholder: "+33 6 12 34 56 78", type: "tel" },
    { key: "email", label: "Email", icon: <Mail size={18} />, placeholder: "contact@example.com", type: "email" },
    { key: "website", label: "Site web", icon: <Globe size={18} />, placeholder: "https://monsite.com", type: "url" },
  ];

  const professionalFields: FieldConfig[] = [
    { key: "linkedin", label: "LinkedIn", icon: <Linkedin size={18} />, placeholder: "https://linkedin.com/in/username" },
  ];

  const socialFields: FieldConfig[] = [
    { key: "twitter", label: "Twitter / X", icon: <Twitter size={18} />, placeholder: "https://twitter.com/username" },
    { key: "instagram", label: "Instagram", icon: <Instagram size={18} />, placeholder: "https://instagram.com/username" },
    { key: "facebook", label: "Facebook", icon: <Facebook size={18} />, placeholder: "https://facebook.com/username" },
    { key: "tiktok", label: "TikTok", icon: <Music2 size={18} />, placeholder: "https://tiktok.com/@username" },
    { key: "youtube", label: "YouTube", icon: <Youtube size={18} />, placeholder: "https://youtube.com/@username" },
    { key: "snapchat", label: "Snapchat", icon: <Camera size={18} />, placeholder: "username" },
  ];

  const techFields: FieldConfig[] = [
    { key: "github", label: "GitHub", icon: <Github size={18} />, placeholder: "https://github.com/username" },
  ];

  const messagingFields: FieldConfig[] = [
    { key: "whatsapp", label: "WhatsApp", icon: <MessageCircle size={18} />, placeholder: "+33612345678", type: "tel" },
    { key: "telegram", label: "Telegram", icon: <Send size={18} />, placeholder: "@username" },
  ];

  const renderFieldGroup = (title: string, fields: FieldConfig[]) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2">
        {fields.map((field) => {
          const fieldData = formData[field.key] as SocialField;
          return (
            <div
              key={field.key}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                fieldData.enabled
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <button
                type="button"
                onClick={() => handleFieldToggle(field.key)}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  fieldData.enabled
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {field.icon}
              </button>
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-slate-500 mb-1">{field.label}</label>
                <input
                  type={field.type || "url"}
                  value={fieldData.value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={!fieldData.enabled}
                  className={`w-full text-sm bg-transparent border-0 p-0 focus:ring-0 outline-none ${
                    fieldData.enabled ? "text-slate-900" : "text-slate-400"
                  }`}
                />
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={fieldData.enabled}
                  onChange={() => handleFieldToggle(field.key)}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Administration</h1>
            <p className="text-sm text-slate-500">Personnalisez votre carte digitale</p>
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
              {formData.avatar ? (
                <img
                  src={formData.avatar}
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
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
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
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Développeur Web"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Entreprise</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Ma Société"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
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
            className={`w-full flex items-center justify-center gap-2 font-medium py-4 px-6 rounded-xl transition-all shadow-lg ${
              saved
                ? "bg-green-500 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow-xl"
            }`}
          >
            <Save size={20} />
            {saved ? "Enregistré !" : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
