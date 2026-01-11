import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Upload } from "lucide-react";

export interface CardData {
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  email: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  github: string;
  avatar: string;
}

const defaultData: CardData = {
  firstName: "Jean",
  lastName: "Dupont",
  bio: "Développeur passionné & créateur digital. J'aime transformer des idées en expériences numériques uniques.",
  phone: "+33612345678",
  email: "contact@example.com",
  linkedin: "https://linkedin.com/in/jeandupont",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  github: "https://github.com",
  avatar: "",
};

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CardData>(defaultData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cardData");
    if (stored) {
      setFormData(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full bg-white shadow hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-slate-800">Administration</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Photo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Photo de profil</label>
            <div className="flex items-center gap-4">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                  <Upload size={24} className="text-slate-400" />
                </div>
              )}
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors px-4 py-2 rounded-lg text-sm font-medium text-slate-700">
                Choisir une photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Nom & Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-800">Contact</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-slate-800">Réseaux sociaux</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Twitter URL</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Save size={20} />
            {saved ? "Enregistré !" : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
