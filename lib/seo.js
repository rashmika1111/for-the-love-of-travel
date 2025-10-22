/**
 * Centralized SEO Configuration for For the Love of Travel
 * This file contains all SEO metadata configurations that can be reused across pages
 */

// Base site configuration
export const siteConfig = {
  name: "For the Love of Travel",
  description: "Stories, guides and videos for travelers and dreamers. Discover amazing destinations, travel tips, and inspiring adventures from around the world.",
  url: "https://fortheloveoftravel.com", // Update this to your actual domain
  ogImage: "/images/logo.png",
  twitterHandle: "@fortheloveoftravel", // Update this to your actual Twitter handle
  author: "For the Love of Travel",
  creator: "For the Love of Travel",
  publisher: "For the Love of Travel",
  googleVerification: "your-google-verification-code", // Update this with your actual verification code
};

// Common keywords used across the site
export const commonKeywords = [
  "travel",
  "destinations", 
  "travel guides",
  "adventure",
  "tourism",
  "travel blog",
  "travel stories",
  "vacation",
  "wanderlust",
  "explore",
  "travel tips",
  "travel inspiration",
  "world travel",
  "travel experiences"
];

// Page-specific keywords
export const pageKeywords = {
  home: [
    ...commonKeywords,
    "travel destinations",
    "travel stories", 
    "adventure guides",
    "travel blog",
    "wanderlust",
    "explore",
    "vacation",
    "tourism",
    "travel tips"
  ],
  content: [
    "technology workplace",
    "digital transformation", 
    "workplace innovation",
    "future of work",
    "technology impact",
    "workplace technology",
    "business technology",
    "digital workplace",
    "workplace trends",
    "business innovation"
  ]
};

// Default metadata configuration
export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: commonKeywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: typeof URL !== 'undefined' ? new URL(siteConfig.url) : undefined,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: siteConfig.googleVerification,
  },
};

// Helper function to generate page metadata
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  authors,
  ...customMetadata
}) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const pageImage = image || siteConfig.ogImage;

  return {
    title: title || siteConfig.name,
    description: pageDescription,
    keywords: [...commonKeywords, ...keywords],
    authors: authors || [{ name: siteConfig.author }],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      type,
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: url || '/',
    },
    ...customMetadata,
  };
}

// Pre-configured metadata for specific pages
export const pageMetadata = {
  home: generatePageMetadata({
    title: "Home",
    description: "Discover amazing travel destinations, inspiring stories, and adventure guides. Explore featured travel posts, latest articles, and popular videos from around the world.",
    keywords: pageKeywords.home,
    image: "/images/74654a8f67369b797c8fb2e96a533fd515fb2939.jpg",
    url: "/",
  }),

  content: generatePageMetadata({
    title: "The Impact of Technology on the Workplace",
    description: "Explore how technology is transforming the modern workplace. Discover insights on workplace innovation, digital transformation, and the future of work in this comprehensive article.",
    keywords: pageKeywords.content,
    image: "/images/07734c5955830a5ec32606611af0eba2c88b8f45.png",
    url: "/content",
    type: "article",
    publishedTime: "2019-05-28T00:00:00.000Z",
    authors: ["John Smith"],
  }),
};

// Helper function to get metadata for a specific page
export function getPageMetadata(pageName) {
  return pageMetadata[pageName] || defaultMetadata;
}

// Helper function to create custom metadata for new pages
export function createCustomMetadata(config) {
  return generatePageMetadata(config);
}

// All exports are done inline above - no need for duplicate exports
