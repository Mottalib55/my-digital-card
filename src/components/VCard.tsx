import { Instagram, Linkedin, Twitter, Github, Mail, Phone, UserPlus } from "lucide-react";
import avatar from "@/assets/avatar.jpg";

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  { icon: <Twitter size={20} />, href: "https://twitter.com", label: "Twitter" },
  { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
  { icon: <Github size={20} />, href: "https://github.com", label: "GitHub" },
];

const contactInfo = {
  firstName: "Jean",
  lastName: "Dupont",
  phone: "+33612345678",
  email: "contact@example.com",
  linkedin: "https://linkedin.com/in/jeandupont",
};

const generateVCard = () => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactInfo.firstName} ${contactInfo.lastName}
N:${contactInfo.lastName};${contactInfo.firstName};;;
TEL;TYPE=CELL:${contactInfo.phone}
EMAIL:${contactInfo.email}
URL:${contactInfo.linkedin}
END:VCARD`;

  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${contactInfo.firstName}_${contactInfo.lastName}.vcf`;
  link.click();
  URL.revokeObjectURL(url);
};

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

        {/* Bouton Ajouter aux contacts */}
        <button 
          onClick={generateVCard}
          className="vcard-add-contact animate-fade-in-delay-3"
        >
          <UserPlus size={20} />
          <span>Ajouter aux contacts</span>
        </button>

        {/* Réseaux Sociaux */}
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
      </div>
    </div>
  );
};

export default VCard;
