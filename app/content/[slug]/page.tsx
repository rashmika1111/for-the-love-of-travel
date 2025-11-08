import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { postsApi } from '../../../lib/api';
import type { Post } from '../../../types';
import ContentPageClient from './ContentPageClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    
    // Only try to fetch metadata if we're in a build context and backend is accessible
    if (process.env.NODE_ENV === 'production') {
      const response = await postsApi.getPost(slug);
      
      if (!response.success || !response.data) {
        return {
          title: 'Post Not Found',
          description: 'The requested post could not be found.',
        };
      }

      const post = response.data;
    
      return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        keywords: post.seo?.keywords?.join(', '),
        authors: [{ name: post.author?.name || 'Unknown Author' }],
        openGraph: {
          title: post.seo?.metaTitle || post.title,
          description: post.seo?.metaDescription || post.excerpt,
          type: 'article',
          publishedTime: post.publishedAt,
          authors: [post.author?.name || 'Unknown Author'],
          images: post.featuredImage?.url ? [{
            url: post.featuredImage.url,
            width: post.featuredImage.width || 1200,
            height: post.featuredImage.height || 630,
            alt: post.featuredImage.alt || post.title,
          }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: post.seo?.metaTitle || post.title,
          description: post.seo?.metaDescription || post.excerpt,
          images: post.featuredImage?.url ? [post.featuredImage.url] : [],
        },
        robots: {
          index: !post.seo?.noIndex,
          follow: !post.seo?.noFollow,
        },
      };
    }
    
    // In development, return default metadata
    return {
      title: 'Travel Post',
      description: 'Discover amazing travel destinations and stories.',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }
}

// Generate static params for popular posts
export async function generateStaticParams() {
  try {
    // Only generate static params if we're in a build context and backend is accessible
    if (process.env.NODE_ENV === 'production') {
      const response = await postsApi.getPosts({ limit: 20 });
      
      if (!response.success || !response.data) {
        return [];
      }

      return response.data.map((post: Post) => ({
        slug: post.slug,
      }));
    }
    
    // In development, return empty array to avoid build-time API calls
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PostPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    const response = await postsApi.getPost(slug);
    
    if (!response.success || !response.data) {
      notFound();
    }

    const post = response.data;

    return <ContentPageClient post={post} />;
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}
