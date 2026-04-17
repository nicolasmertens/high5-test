import { Helmet } from "react-helmet-async";

const OG_IMAGE = "https://1test.me/og-image.png";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  jsonLd?: object[];
  ogType?: string;
}

export function SEOHead({
  title,
  description,
  canonicalUrl,
  jsonLd = [],
  ogType = "website",
}: SEOHeadProps) {
  const allJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonicalUrl,
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
          name: "Home",
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
                item: canonicalUrl,
              },
            ]
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: title.replace(" | 1Test.me", ""),
                item: canonicalUrl,
              },
            ]),
      ],
    },
    ...jsonLd,
  ];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
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