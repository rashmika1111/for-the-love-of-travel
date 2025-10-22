import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Category } from '@/types';

interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home */}
      <Link 
        href="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={item.position} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link 
              href={item.url}
              className="hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper function to build breadcrumbs from category hierarchy
export function buildCategoryBreadcrumbs(
  primaryCategory: Category | undefined,
  postTitle: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  if (!primaryCategory) {
    return breadcrumbs;
  }

  // Add category breadcrumb
  breadcrumbs.push({
    name: primaryCategory.name,
    url: `/category/${primaryCategory.slug}`,
    position: 1
  });

  // Add post title as final breadcrumb
  breadcrumbs.push({
    name: postTitle,
    url: '', // Current page, no link
    position: 2
  });

  return breadcrumbs;
}

// JSON-LD structured data for breadcrumbs
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}${item.url}` : undefined
    }))
  };

  return jsonLd;
}


