import { Instagram, Linkedin, Twitter, Github, Mail, Phone } from "lucide-react";
import avatar from "@/assets/avatar.jpg";

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: <Linkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: <Twitter size={20} />, href: "https://twitter.com", label: "Twitter" },
  { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
  { icon: <Github size={20} />, href: "https://github.com", label: "GitHub" },
  { icon: <Mail size={20} />, href: "mailto:contact@example.com", label: "Email" },
];

const VCard = () => {
  return (
    <div className="vcard-container">
      <div className="vcard-card">
        {/* Avatar */}
        <div className="animate-fade-in">
          <img
            src={avatar}
            alt="Photo de profil"
            className="vcard-avatar"
          />
        </div>

        {/* Nom */}
        <h1 className="vcard-name animate-fade-in-delay-1">
          Jean Dupont
        </h1>

        {/* Mini Bio */}
        <p className="vcard-bio animate-fade-in-delay-2">
          Développeur passionné & créateur digital. J'aime transformer des idées en expériences numériques uniques.
        </p>

        {/* Numéro de téléphone */}
        <a 
          href="tel:+33612345678" 
          className="vcard-phone animate-fade-in-delay-2"
        >
          <Phone size={18} />
          <span>+33 6 12 34 56 78</span>
        </a>

        {/* Email */}
        <a 
          href="mailto:contact@example.com" 
          className="vcard-phone animate-fade-in-delay-2"
        >
          <Mail size={18} />
          <span>contact@example.com</span>
        </a>

        {/* LinkedIn */}
        <a 
          href="https://linkedin.com/in/jeandupont" 
          target="_blank"
          rel="noopener noreferrer"
          className="vcard-phone animate-fade-in-delay-2"
        >
          <Linkedin size={18} />
          <span>linkedin.com/in/jeandupont</span>
        </a>

        {/* Réseaux Sociaux */}
        <div className="flex gap-3 mt-8 animate-fade-in-delay-3">
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
      </div>
    </div>
  );
};

export default VCard;
