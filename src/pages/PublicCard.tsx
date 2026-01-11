import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Instagram, Linkedin, Twitter, Github, Facebook, Youtube,
  Mail, Phone, UserPlus, Globe, MessageCircle, Send, Music2, Camera, QrCode, Download,
  LayoutDashboard, LogIn, UserPlus as UserPlusIcon
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase, Profile } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const PublicCard = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    if (!username) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Demo profile
    if (username === "demo") {
      setProfile({
        id: "demo",
        user_id: "demo",
        username: "demo",
        first_name: "Marie",
        last_name: "Martin",
        title: "UX Designer",
        company: "Creative Studio",
        bio: "Passionate about design and user experience. I create intuitive and elegant interfaces.",
        avatar_url: "",
        phone: "+33612345678",
        phone_enabled: true,
        email_contact: "marie@example.com",
        email_enabled: true,
        website: "https://mariemartin.design",
        website_enabled: true,
        linkedin: "https://linkedin.com/in/mariemartin",
        linkedin_enabled: true,
        twitter: "https://twitter.com/mariemartin",
        twitter_enabled: true,
        instagram: "https://instagram.com/mariemartin",
        instagram_enabled: true,
        facebook: "",
        facebook_enabled: false,
        tiktok: "",
        tiktok_enabled: false,
        youtube: "",
        youtube_enabled: false,
        snapchat: "",
        snapchat_enabled: false,
        github: "",
        github_enabled: false,
        whatsapp: "+33612345678",
        whatsapp_enabled: true,
        telegram: "",
        telegram_enabled: false,
        created_at: "",
        updated_at: "",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      console.log("Profile data:", data);
      console.log("WhatsApp:", data.whatsapp, "Enabled:", data.whatsapp_enabled);
      setProfile(data);
    }
    setLoading(false);
  };

  const isFieldActive = (value: string | undefined, enabled: boolean | undefined) => {
    return enabled && value && value.trim() !== "";
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("+33") && cleaned.length === 12) {
      return cleaned.replace(/(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5 $6");
    }
    return phone;
  };

  const generateVCard = () => {
    if (!profile) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.first_name} ${profile.last_name}
N:${profile.last_name};${profile.first_name};;;
${profile.title ? `TITLE:${profile.title}` : ""}
${profile.company ? `ORG:${profile.company}` : ""}
${isFieldActive(profile.phone, profile.phone_enabled) ? `TEL;TYPE=CELL:${profile.phone}` : ""}
${isFieldActive(profile.email_contact, profile.email_enabled) ? `EMAIL:${profile.email_contact}` : ""}
${isFieldActive(profile.website, profile.website_enabled) ? `URL:${profile.website}` : ""}
END:VCARD`.replace(/\n{2,}/g, "\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.first_name}_${profile.last_name}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9+]/g, "").replace("+", "");
    return `https://wa.me/${cleaned}`;
  };

  const getTelegramLink = (username: string) => {
    const cleaned = username.replace("@", "");
    return `https://t.me/${cleaned}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-slate-500 mb-6">This card doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const socialLinks = [
    { key: "linkedin", icon: <Linkedin size={20} />, value: profile.linkedin, enabled: profile.linkedin_enabled, label: "LinkedIn" },
    { key: "twitter", icon: <Twitter size={20} />, value: profile.twitter, enabled: profile.twitter_enabled, label: "Twitter" },
    { key: "instagram", icon: <Instagram size={20} />, value: profile.instagram, enabled: profile.instagram_enabled, label: "Instagram" },
    { key: "facebook", icon: <Facebook size={20} />, value: profile.facebook, enabled: profile.facebook_enabled, label: "Facebook" },
    { key: "tiktok", icon: <Music2 size={20} />, value: profile.tiktok, enabled: profile.tiktok_enabled, label: "TikTok" },
    { key: "youtube", icon: <Youtube size={20} />, value: profile.youtube, enabled: profile.youtube_enabled, label: "YouTube" },
    { key: "snapchat", icon: <Camera size={20} />, value: profile.snapchat, enabled: profile.snapchat_enabled, label: "Snapchat" },
    { key: "github", icon: <Github size={20} />, value: profile.github, enabled: profile.github_enabled, label: "GitHub" },
    {
      key: "whatsapp",
      icon: <MessageCircle size={20} />,
      value: profile.whatsapp,
      enabled: profile.whatsapp_enabled,
      label: "WhatsApp",
      href: getWhatsAppLink(profile.whatsapp || ""),
    },
    {
      key: "telegram",
      icon: <Send size={20} />,
      value: profile.telegram,
      enabled: profile.telegram_enabled,
      label: "Telegram",
      href: getTelegramLink(profile.telegram || ""),
    },
  ].filter((link) => {
    const active = isFieldActive(link.value, link.enabled);
    if (link.key === "whatsapp") {
      console.log("WhatsApp filter:", { value: link.value, enabled: link.enabled, active });
    }
    return active;
  });

  const hasName = profile.first_name || profile.last_name;
  const hasContactInfo =
    isFieldActive(profile.phone, profile.phone_enabled) ||
    isFieldActive(profile.email_contact, profile.email_enabled) ||
    isFieldActive(profile.website, profile.website_enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      {/* Navigation */}
      {!authLoading && (
        <div className="max-w-md mx-auto mb-4">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <LayoutDashboard size={18} />
              My Dashboard
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <LogIn size={18} />
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <UserPlusIcon size={18} />
                Create my card for free
              </button>
            </div>
          )}
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {(profile.first_name?.[0] || "").toUpperCase()}
                {(profile.last_name?.[0] || "").toUpperCase()}
              </div>
            )}
          </div>

          {/* Nom */}
          {hasName && (
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
              {profile.first_name} {profile.last_name}
            </h1>
          )}

          {/* Titre & Entreprise */}
          {(profile.title || profile.company) && (
            <p className="text-slate-500 text-center mb-4">
              {profile.title}
              {profile.title && profile.company && " · "}
              {profile.company}
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="text-slate-600 text-center mb-6 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Contact Info */}
          {hasContactInfo && (
            <div className="space-y-3 mb-6">
              {isFieldActive(profile.phone, profile.phone_enabled) && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
                    <Phone size={18} />
                  </div>
                  <span className="text-slate-700">{formatPhone(profile.phone!)}</span>
                </a>
              )}

              {isFieldActive(profile.email_contact, profile.email_enabled) && (
                <a
                  href={`mailto:${profile.email_contact}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
                    <Mail size={18} />
                  </div>
                  <span className="text-slate-700">{profile.email_contact}</span>
                </a>
              )}

              {isFieldActive(profile.website, profile.website_enabled) && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
                    <Globe size={18} />
                  </div>
                  <span className="text-slate-700">{profile.website!.replace(/https?:\/\/(www\.)?/, "")}</span>
                </a>
              )}
            </div>
          )}

          {/* Bouton Ajouter aux contacts */}
          {hasName && (
            <button
              onClick={generateVCard}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-medium hover:bg-slate-800 transition-colors mb-6"
            >
              <UserPlus size={20} />
              Add to contacts
            </button>
          )}

          {/* Réseaux Sociaux */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={(link as any).href || link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-700 transition-colors"
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}

          {/* QR Code */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100">
                <QRCodeCanvas
                  id="qr-code"
                  value={`${window.location.origin}${import.meta.env.BASE_URL}#/card/${username}`}
                  size={120}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="flex items-center gap-4 mt-3">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <QrCode size={14} />
                  Scan to share
                </p>
                <button
                  onClick={() => {
                    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
                    const url = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `qrcode-${username}.png`;
                    link.click();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
                >
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Create your card on{" "}
          <button onClick={() => navigate("/")} className="text-slate-600 hover:underline">
            DigiCard
          </button>
        </p>
      </div>
    </div>
  );
};

export default PublicCard;
