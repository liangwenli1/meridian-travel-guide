import type { City } from "@/types/catalog";
import type { CityGuide } from "@/types/guide";

export function JsonLd({ city, guide }: { city: City; guide: CityGuide }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristDestination",
        name: city.name,
        description: guide.seoDescription,
        url: `/${city.countrySlug}/${city.slug}`,
        address: {
          "@type": "PostalAddress",
          addressCountry: city.countryCode,
          addressLocality: city.name,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Meridian", item: "/" },
          { "@type": "ListItem", position: 2, name: city.country, item: `/${city.countrySlug}` },
          {
            "@type": "ListItem",
            position: 3,
            name: city.name,
            item: `/${city.countrySlug}/${city.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
