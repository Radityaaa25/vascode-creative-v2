import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SEO({ title, description, canonical, noIndex }: {
  title: string
  description?: string
  canonical?: string
  noIndex?: boolean
}) {
  const { language, content } = useLanguage()
  const siteUrl = 'https://vascode.my.id'
  const fullTitle = `${title} | Vascode Creative`

  useEffect(() => {
    document.title = fullTitle
    document.documentElement.lang = language === 'id' ? 'id' : 'en'
    let canon = document.querySelector('link[rel="canonical"]')
    if (!canon) {
      canon = document.createElement('link')
      canon.setAttribute('rel', 'canonical')
      document.head.appendChild(canon)
    }
    canon.setAttribute('href', canonical || siteUrl)
    if (noIndex) {
      let robots = document.querySelector('meta[name="robots"]')
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex, nofollow')
    } else {
      document.querySelector('meta[name="robots"]')?.remove()
    }
  }, [fullTitle, language, canonical, noIndex])

  const wa = content.contact.whatsapp ? `+${content.contact.whatsapp}` : '+6281412234070'
  const stats = content.stats.length > 0 ? content.stats : [{ label: 'Projects Completed', value: '50+' }, { label: 'Happy Clients', value: '30+' }, { label: 'Satisfaction Rate', value: '100%' }]
  const statValue = (label: string) => stats.find((s) => s.label.toLowerCase().includes(label))?.value || '0'

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vascode Creative',
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    description: 'Creative agency & production house specializing in website development, video ads, photography, videography, and graphic design.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: wa,
      availableLanguage: ['English', 'Indonesian'],
    },
    sameAs: [
      `https://www.instagram.com/${content.contact.instagram}`,
      `https://wa.me/${content.contact.whatsapp}`,
      `mailto:${content.contact.email}`,
    ].filter(Boolean),
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vascode Creative',
    url: siteUrl,
    description: 'Creative agency & production house in Indonesia. Website development, video ads, photography, videography, and graphic design services.',
    inLanguage: language === 'id' ? 'id' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const ratingSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Organization',
      name: 'Vascode Creative',
    },
    ratingValue: '5',
    bestRating: '5',
    ratingCount: statValue('project').replace('+', ''),
    reviewCount: statValue('client').replace('+', ''),
  }

  const serviceSchemas = content.services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.description,
    provider: {
      '@type': 'Organization',
      name: 'Vascode Creative',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'IDR',
      },
    },
  }))

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does Vascode Creative offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer website development, video ads production, photography & videography, video & photo editing, and graphic design services for businesses in Indonesia.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I contact Vascode Creative?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can reach us via WhatsApp at ${wa}, email at ${content.contact.email}, or Instagram at @${content.contact.instagram}.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Vascode Creative based?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vascode Creative is a creative agency based in Indonesia, serving clients nationwide with digital services.',
        },
      },
    ],
  }

  const localBizSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Vascode Creative',
    url: siteUrl,
    telephone: wa,
    email: content.contact.email,
    image: `${siteUrl}/favicon.png`,
    description: 'Creative agency & production house in Indonesia.',
    address: { '@type': 'PostalAddress', addressCountry: 'ID' },
    sameAs: [
      `https://www.instagram.com/${content.contact.instagram}`,
      `https://wa.me/${content.contact.whatsapp}`,
    ].filter(Boolean),
    priceRange: '$$',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([orgSchema, websiteSchema, ratingSchema, localBizSchema, faqSchema, ...serviceSchemas]),
      }}
    />
  )
}
