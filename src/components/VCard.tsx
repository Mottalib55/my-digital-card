import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Linkedin, Twitter, Github, Mail, Phone, UserPlus, Settings } from "lucide-react";
import defaultAvatar from "@/assets/avatar.jpg";
import type { CardData } from "@/pages/Admin";

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

const VCard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CardData>(defaultData);

  useEffect(() => {
    const stored = localStorage.getItem("cardData");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const formatPhone = (phone: string) => {
    return phone.replace(/(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5 $6");
  };

  const generateVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.firstName} ${data.lastName}
N:${data.lastName};${data.firstName};;;
TEL;TYPE=CELL:${data.phone}
EMAIL:${data.email}
URL:${data.linkedin}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.firstName}_${data.lastName}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const socialLinks = [
    { icon: <Twitter size={20} />, href: data.twitter, label: "Twitter" },
    { icon: <Instagram size={20} />, href: data.instagram, label: "Instagram" },
    { icon: <Github size={20} />, href: data.github, label: "GitHub" },
  ].filter(link => link.href);

  return (
    <div className="vcard-container">
      {/* Bouton Admin */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-4 left-4 p-2 rounded-full bg-white/80 backdrop-blur shadow hover:bg-white transition-colors"
        aria-label="Administration"
      >
        <Settings size={20} className="text-slate-600" />
      </button>

      <div className="vcard-card">
        {/* Avatar */}
        <div className="animate-fade-in">
          <img
            src={data.avatar || defaultAvatar}
            alt="Photo de profil"
            className="vcard-avatar"
          />
        </div>

        {/* Nom */}
        <h1 className="vcard-name animate-fade-in-delay-1">
          {data.firstName} {data.lastName}
        </h1>

        {/* Mini Bio */}
        <p className="vcard-bio animate-fade-in-delay-2">
          {data.bio}
        </p>

        {/* Numéro de téléphone */}
        {data.phone && (
          <a
            href={`tel:${data.phone}`}
            className="vcard-phone animate-fade-in-delay-2"
          >
            <Phone size={18} />
            <span>{formatPhone(data.phone)}</span>
          </a>
        )}

        {/* Email */}
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="vcard-phone animate-fade-in-delay-2"
          >
            <Mail size={18} />
            <span>{data.email}</span>
          </a>
        )}

        {/* LinkedIn */}
        {data.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="vcard-phone animate-fade-in-delay-2"
          >
            <Linkedin size={18} />
            <span>{data.linkedin.replace(/https?:\/\/(www\.)?/, '')}</span>
          </a>
        )}

        {/* Bouton Ajouter aux contacts */}
        <button
          onClick={generateVCard}
          className="vcard-add-contact animate-fade-in-delay-3"
        >
          <UserPlus size={20} />
          <span>Ajouter aux contacts</span>
        </button>

        {/* Réseaux Sociaux */}
        {socialLinks.length > 0 && (
          <div className="flex gap-3 mt-6 animate-fade-in-delay-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="vcard-social-link"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VCard;
