import { Helmet } from "react-helmet-async";
import { useLanguage } from "../contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "../i18n";

const DEFAULT_OG_IMAGE = "https://1test.me/og-image.png";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  jsonLd?: object[];
  ogType?: string;
  ogImage?: string;
}

export function SEOHead({
  title,
  description,
  canonicalUrl,
  jsonLd = [],
  ogType = "website",
  ogImage,
}: SEOHeadProps) {
  const { lang } = useLanguage();
  const image = ogImage || DEFAULT_OG_IMAGE;

  const pathWithoutLang = canonicalUrl.replace("https://1test.me", "").replace(/^\/(de|fr)(\/|$)/, "/");
  const cleanPath = pathWithoutLang === "" ? "/" : pathWithoutLang;

  const localizedCanonical = lang === "en"
    ? `https://1test.me${cleanPath === "/" ? "" : cleanPath}`
    : `https://1test.me/${lang}${cleanPath === "/" ? "" : cleanPath}`;

  const hreflangs = SUPPORTED_LANGUAGES.map((l) => {
    const url = l === "en"
      ? `https://1test.me${cleanPath === "/" ? "" : cleanPath}`
      : `https://1test.me/${l}${cleanPath === "/" ? "" : cleanPath}`;
    return { lang: l, url };
  });

  const allJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: localizedCanonical,
      datePublished: "2026-04-10",
      dateModified: "2026-04-10",
      publisher: {
        "@type": "Organization",
        name: "1Test",
        url: "https://1test.me",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: lang === "de" ? "Startseite" : lang === "fr" ? "Accueil" : "Home",
          item: "https://1test.me",
        },
        ...(canonicalUrl.includes("/blog/")
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://1test.me/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: title.replace(" | 1Test.me", ""),
                item: localizedCanonical,
              },
            ]
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: title.replace(" | 1Test.me", ""),
                item: localizedCanonical,
              },
            ]),
      ],
    },
    ...jsonLd,
  ];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={localizedCanonical} />

      {hreflangs.map((h) => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`https://1test.me${cleanPath === "/" ? "" : cleanPath}`} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={localizedCanonical} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={lang === "de" ? "de_DE" : lang === "fr" ? "fr_FR" : "en_US"} />
      {hreflangs.filter((h) => h.lang !== lang).map((h) => (
        <meta key={h.lang} property="og:locale:alternate" content={h.lang === "de" ? "de_DE" : h.lang === "fr" ? "fr_FR" : "en_US"} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {allJsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export function buildFAQSchema(
  faqs: { question: string; answer: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleSchema(data: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description,
    url: data.url,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      "@type": "Organization",
      name: "1Test",
    },
    publisher: {
      "@type": "Organization",
      name: "1Test",
      url: "https://1test.me",
    },
  };
}