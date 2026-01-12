import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { detectBrowserLanguage } from "@/lib/i18n";

const LanguageRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lang = detectBrowserLanguage();
    navigate(`/${lang}`, { replace: true });
  }, [navigate]);

  return null;
};

export default LanguageRedirect;
