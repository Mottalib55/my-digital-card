import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  locale?: "fr_FR" | "en_US";
  noindex?: boolean;
  jsonLd?: object;
}

const SEO = ({
  title = "75tools - Vos outils de productivité",
  description = "Des solutions gratuites pour augmenter votre performance et éclairer vos décisions professionnelles. Créez votre carte de visite digitale, calculez votre salaire net et plus encore.",
  keywords = "outils productivité, carte visite digitale, calculateur salaire, outils gratuits, MyCard, NetSalaire, 75tools",
  url = "https://75tools.fr",
  image = "https://75tools.fr/og-image.png",
  type = "website",
  locale = "fr_FR",
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title.includes("75tools") ? title : `${title} | 75tools`;

  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "75tools",
    url: "https://75tools.fr",
    description: "Hub d'outils de productivité gratuits",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://75tools.fr/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="75tools" />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="75tools" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="apple-mobile-web-app-title" content="75tools" />
      <meta name="application-name" content="75tools" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;
